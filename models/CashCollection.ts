import mongoose, { Schema, Document, Model } from 'mongoose';

// Enum types
type DocumentType = 'invoice' | 'quotation' | 'cash_sale';
type PaymentMode = 'mpesa' | 'cash' | 'cheque' | 'bank_transfer' | 'card';
type CollectionStatus = 'pending' | 'verified' | 'deposited' | 'cancelled';

// Interface for summary aggregation result
export interface ICashCollectionSummary {
  totalAmount: number;
  totalCollections: number;
  totalVerified: number;
  totalPending: number;
  totalDeposited: number;
  byPaymentMode: Record<string, number>;
}

// Main CashCollection interface
export interface ICashCollection extends Document {
  customerName: string;
  documentNumber: string;
  documentType: DocumentType;
  amountPaid: number;
  modeOfPayment: PaymentMode;
  mpesaReference?: string;
  mpesaPhone?: string;
  chequeNumber?: string;
  chequeBank?: string;
  chequeDate?: Date;
  bankReference?: string;
  bankName?: string;
  paymentDate: Date;
  collectedBy: string;
  status: CollectionStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  depositedToBank: boolean;
  depositDate?: Date;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for aggregation match stage
interface IMatchStage {
  paymentDate?: {
    $gte?: Date;
    $lte?: Date;
  };
}

// Interface for static methods
interface ICashCollectionModel extends Model<ICashCollection> {
  getSummary(startDate?: Date | string, endDate?: Date | string): Promise<ICashCollectionSummary[]>;
}

const cashCollectionSchema = new Schema<ICashCollection, ICashCollectionModel>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    documentNumber: {
      type: String,
      required: true,
      trim: true
    },
    documentType: {
      type: String,
      enum: ['invoice', 'quotation', 'cash_sale'],
      required: true
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0
    },
    modeOfPayment: {
      type: String,
      enum: ['mpesa', 'cash', 'cheque', 'bank_transfer', 'card'],
      required: true
    },
    mpesaReference: {
      type: String,
      trim: true
    },
    mpesaPhone: {
      type: String,
      trim: true
    },
    chequeNumber: {
      type: String,
      trim: true
    },
    chequeBank: {
      type: String,
      trim: true
    },
    chequeDate: {
      type: Date
    },
    bankReference: {
      type: String,
      trim: true
    },
    bankName: {
      type: String,
      trim: true
    },
    paymentDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    collectedBy: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'deposited', 'cancelled'],
      default: 'pending'
    },
    verifiedBy: {
      type: String,
      trim: true
    },
    verifiedAt: {
      type: Date
    },
    depositedToBank: {
      type: Boolean,
      default: false
    },
    depositDate: {
      type: Date
    },
    notes: {
      type: String,
      trim: true
    },
    createdBy: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
cashCollectionSchema.index({ documentNumber: 1 });
cashCollectionSchema.index({ customerName: 1 });
cashCollectionSchema.index({ paymentDate: -1 });
cashCollectionSchema.index({ modeOfPayment: 1 });
cashCollectionSchema.index({ status: 1 });

// Pre-save middleware to update timestamps
cashCollectionSchema.pre('save', async function() {
  this.updatedAt = new Date();
  
  if (this.modeOfPayment === 'mpesa' && this.mpesaReference && this.status === 'pending') {
    this.status = 'verified';
    this.verifiedAt = new Date();
  }
});

// Static method to get summary
cashCollectionSchema.statics.getSummary = async function(
  startDate?: Date | string, 
  endDate?: Date | string
): Promise<ICashCollectionSummary[]> {
  const matchStage: IMatchStage = {};
  
  if (startDate || endDate) {
    matchStage.paymentDate = {};
    if (startDate) matchStage.paymentDate.$gte = new Date(startDate);
    if (endDate) matchStage.paymentDate.$lte = new Date(endDate);
  }

  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amountPaid' },
        totalCollections: { $sum: 1 },
        totalVerified: {
          $sum: { $cond: [{ $eq: ['$status', 'verified'] }, 1, 0] }
        },
        totalPending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        totalDeposited: {
          $sum: { $cond: ['$depositedToBank', 1, 0] }
        },
        byPaymentMode: {
          $push: {
            mode: '$modeOfPayment',
            amount: '$amountPaid'
          }
        }
      }
    },
    {
      $project: {
        totalAmount: 1,
        totalCollections: 1,
        totalVerified: 1,
        totalPending: 1,
        totalDeposited: 1,
        byPaymentMode: {
          $arrayToObject: {
            $map: {
              input: '$byPaymentMode',
              as: 'item',
              in: {
                k: '$$item.mode',
                v: { $sum: '$$item.amount' }
              }
            }
          }
        }
      }
    }
  ]) as ICashCollectionSummary[];
};

const CashCollection = mongoose.model<ICashCollection, ICashCollectionModel>('CashCollection', cashCollectionSchema);

export default CashCollection;
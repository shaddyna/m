import mongoose, { Document, Model, Schema } from 'mongoose';

// 1. Define the interface for the document
export interface IRecordV2 extends Document {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  timestamp: Date;
  customerName: string;
  invoiceNo?: string;
  cashSaleNo?: string;
  quotationNo?: string;
  documentType: 'invoice' | 'cashSale' | 'quotation';
  facilitator: string;
  amount: number;
  createdBy: string;
  originalRecordId?: string;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define the interface for statics
interface IRecordV2Model extends Model<IRecordV2> {
  createTimestamp(dateStr: string, timeStr: string): Date;
}

// 3. Define the schema
const recordV2Schema = new Schema<IRecordV2, IRecordV2Model>({
  id: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  timestamp: { type: Date, required: true },
  customerName: { type: String, required: true },
  invoiceNo: String,
  cashSaleNo: String,
  quotationNo: String,
  documentType: { type: String, enum: ['invoice', 'cashSale', 'quotation'], required: true },
  facilitator: { type: String, required: true },
  amount: { type: Number, required: true },
  createdBy: { type: String, required: true },
  originalRecordId: String,
  version: { type: Number, default: 2 },
}, {
  timestamps: true
});

// 4. Static method
recordV2Schema.statics.createTimestamp = function(dateStr: string, timeStr: string): Date {
  const timeWithSeconds = timeStr.includes(':') ? 
    (timeStr.split(':').length === 2 ? `${timeStr}:00` : timeStr) : 
    `${timeStr}:00:00`;

  return new Date(`${dateStr}T${timeWithSeconds}`);
};

// 5. Pre-save hook
recordV2Schema.pre<IRecordV2>('save', async function(this: IRecordV2) {
  if (this.date && this.time && !this.timestamp) {
    this.timestamp = (this.constructor as IRecordV2Model).createTimestamp(this.date, this.time);
  }
});


// 6. Indexes
recordV2Schema.index({ timestamp: -1 });
recordV2Schema.index({ documentType: 1 });
recordV2Schema.index({ customerName: 1 });

// 7. Model
const RecordV2 = mongoose.model<IRecordV2, IRecordV2Model>('RecordV2', recordV2Schema);

export default RecordV2;

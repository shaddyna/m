import mongoose, {
  Schema,
  Document,
  Model,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";

/**
 * 1️⃣ Interfaces
 */

export interface ISalesItem {
  description?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  taxRate?: number;
}

export interface ISales extends Document {
  recordId: string;

  documentType: "invoice" | "cash_sale" | "quotation";
  documentNumber: string;

  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;

  date: Date;
  amount: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;

  paymentMethod: "cash" | "credit" | "bank_transfer" | "check" | "mobile_money" | null;
  paymentStatus: "pending" | "partial" | "paid" | "cancelled";
  paidAmount: number;
  balanceDue: number;

  items: ISalesItem[];

  accountCode: string;
  ledgerPosted: boolean;
  ledgerDate?: Date;

  status:
    | "draft"
    | "issued"
    | "approved"
    | "delivered"
    | "completed"
    | "cancelled";

  salesPerson?: string;
  facilitator: string;

  notes?: string;
  termsAndConditions?: string;
  validityPeriod?: Date;

  createdBy: string;
  updatedBy?: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * 2️⃣ Model statics interface
 */
export interface ISalesModel extends Model<ISales> {
  createFromRecord(record: any, additionalData?: Record<string, any>): Promise<ISales>;
}

/**
 * 3️⃣ Schema
 */
const salesSchema = new Schema<ISales>(
  {
    recordId: {
      type: String,
      required: true,
      ref: "Record",
    },

    documentType: {
      type: String,
      enum: ["invoice", "cash_sale", "quotation"],
      required: true,
      index: true,
    },
    documentNumber: {
      type: String,
      required: true,
      unique: true,
    },

    customerName: {
      type: String,
      required: true,
    },
    customerEmail: String,
    customerPhone: String,
    customerAddress: String,

    date: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "credit", "bank_transfer", "check", "mobile_money", null],
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "cancelled"],
      default: "pending",
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    balanceDue: {
      type: Number,
      default: 0,
    },

    items: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
        taxRate: Number,
      },
    ],

    accountCode: {
      type: String,
      default: "4000",
    },
    ledgerPosted: {
      type: Boolean,
      default: false,
    },
    ledgerDate: Date,

    status: {
      type: String,
      enum: ["draft", "issued", "approved", "delivered", "completed", "cancelled"],
      default: "issued",
    },
    salesPerson: String,
    facilitator: {
      type: String,
      required: true,
    },

    notes: String,
    termsAndConditions: String,
    validityPeriod: Date,

    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

/**
 * 4️⃣ Indexes
 */
salesSchema.index({ date: -1 });
salesSchema.index({ customerName: 1 });
salesSchema.index({ documentType: 1, documentNumber: 1 });
salesSchema.index({ paymentStatus: 1 });
salesSchema.index({ status: 1 });

/**
 * 5️⃣ Pre-save middleware (NO next() needed)
 */
salesSchema.pre<ISales>("save", function () {
  if (this.items && this.items.length > 0) {
    const itemsTotal = this.items.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );

    if (!this.amount && itemsTotal > 0) {
      this.amount = itemsTotal;
    }
  }

  this.totalAmount =
    (this.amount || 0) + (this.taxAmount || 0) - (this.discount || 0);

  this.balanceDue = this.totalAmount - (this.paidAmount || 0);

  if (this.balanceDue <= 0 && this.totalAmount > 0) {
    this.paymentStatus = "paid";
  } else if (this.paidAmount > 0 && this.balanceDue > 0) {
    this.paymentStatus = "partial";
  } else if (this.paidAmount === 0 && this.totalAmount > 0) {
    this.paymentStatus = "pending";
  }

  this.updatedAt = new Date();
});

/**
 * 6️⃣ Static: createFromRecord
 */
salesSchema.statics.createFromRecord = async function (
  record: any,
  additionalData: Record<string, any> = {}
) {
  let documentType: ISales["documentType"];
  let documentNumber: string;

  if (record.invoiceNo) {
    documentType = "invoice";
    documentNumber = record.invoiceNo;
  } else if (record.cashSaleNo) {
    documentType = "cash_sale";
    documentNumber = record.cashSaleNo;
  } else if (record.quotationNo) {
    documentType = "quotation";
    documentNumber = record.quotationNo;
  } else {
    throw new Error("No valid document number found in record");
  }

  let paymentStatus: ISales["paymentStatus"] = "pending";
  let paymentMethod: ISales["paymentMethod"] = null;

  if (documentType === "cash_sale") {
    paymentStatus = "paid";
    paymentMethod = "cash";
  }

  return this.create({
    recordId: record.id,
    documentType,
    documentNumber,
    customerName: record.customerName,
    date: record.date,
    amount: record.amount,
    totalAmount: record.amount,
    paymentMethod,
    paymentStatus,
    paidAmount: documentType === "cash_sale" ? record.amount : 0,
    balanceDue: documentType === "cash_sale" ? 0 : record.amount,
    facilitator: record.facilitator,
    createdBy: record.createdBy,
    ...additionalData,
  });
};

/**
 * 7️⃣ Next.js-safe export
 */
const Sales: ISalesModel =
  (mongoose.models.Sales as ISalesModel) ||
  mongoose.model<ISales, ISalesModel>("Sales", salesSchema);

export default Sales;


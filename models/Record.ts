import mongoose, { Document, Schema, Model } from "mongoose";

/* 1. Document interface */
export interface IRecord extends Document {
  id: string;

  date: Date;
  time: Date;

  customerName: string;

  invoiceNo?: string;
  cashSaleNo?: string;
  quotationNo?: string;

  facilitator: string;
  amount: number;
  createdBy: string;

  createdAt: Date;
  updatedAt?: Date;
}

/* 2. Model type */
type RecordModel = Model<IRecord>;

/* 3. Schema */
const recordSchema = new Schema<IRecord>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: Date,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    invoiceNo: String,
    cashSaleNo: String,
    quotationNo: String,

    facilitator: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

/* 4. Validation hook (async, TS-safe) */
recordSchema.pre<IRecord>("validate", async function () {
  const docTypes = [
    this.invoiceNo ? 1 : 0,
    this.cashSaleNo ? 1 : 0,
    this.quotationNo ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  if (docTypes !== 1) {
    this.invalidate(
      "documentType",
      "Exactly one document type must be provided (invoiceNo, cashSaleNo, or quotationNo)"
    );
  }
});

/* 5. Model export (hot-reload safe) */
const Record =
  (mongoose.models.Record as RecordModel) ||
  mongoose.model<IRecord, RecordModel>("Record", recordSchema);

export default Record;

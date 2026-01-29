import mongoose, { Document, Schema, Model } from "mongoose";

/* 1. Document interface */
export interface IClean extends Document {
  documentType: "INVOICE" | "CASH_SALE" | "QUOTATION";
  documentNo?: string;
  amount: number;

  originalCreatedAt: string;

  created_time_utc: string;
  created_time_nairobi: string;

  createdAt_date: number;
  createdAt_text: string;

  created_year: number;
  created_month: number;
  created_day: number;

  createdBy: string;
  customerName: string;
  facilitator: string;

  createdAt?: Date;
  updatedAt?: Date;
}

/* 2. Model type */
type CleanModel = Model<IClean>;

/* 3. Schema */
const CleanSchema = new Schema<IClean>(
  {
    documentType: {
      type: String,
      enum: ["INVOICE", "CASH_SALE", "QUOTATION"],
      required: true,
      index: true,
    },

    documentNo: {
      type: String,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    originalCreatedAt: {
      type: String,
      required: true,
    },

    created_time_utc: {
      type: String,
      required: true,
    },

    created_time_nairobi: {
      type: String,
      required: true,
    },

    createdAt_date: {
      type: Number,
      required: true,
      index: true,
    },

    createdAt_text: {
      type: String,
      required: true,
    },

    created_year: {
      type: Number,
      required: true,
      index: true,
    },

    created_month: {
      type: Number,
      required: true,
      index: true,
    },

    created_day: {
      type: Number,
      required: true,
    },

    createdBy: {
      type: String,
      required: true,
    },

    customerName: {
      type: String,
      required: true,
    },

    facilitator: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

/* 4. Compound unique index */
CleanSchema.index(
  { documentType: 1, documentNo: 1 },
  { unique: true }
);

/* 5. Model export (safe for Next.js / hot reload) */
const Clean =
  (mongoose.models.Clean as CleanModel) ||
  mongoose.model<IClean, CleanModel>("Clean", CleanSchema);

export default Clean;

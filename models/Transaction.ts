import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * 1️⃣ Transaction document interface
 */
export interface ITransaction extends Document {
  type: "income" | "expense";
  date?: Date;
  description: string;
  category?: string;
  method: "cash" | "bank" | "mpesa" | "card";
  amount: number;
  reference: string;
  status: "completed" | "pending";
}

/**
 * 2️⃣ Schema
 */
const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    date: {
      type: Date,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    method: {
      type: String,
      enum: ["cash", "bank", "mpesa", "card"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["completed", "pending"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 3️⃣ Safe export for Next.js
 */
const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;

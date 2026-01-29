import mongoose, { Document, Schema, Model } from "mongoose";

/* =======================
   Interface
======================= */

export interface IExpense extends Document {
  amount: number;
  date: Date;
  description: string;
  vendor: string;
  category: string;
  paymentMethod?: string;
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

/* =======================
   Schema
======================= */

const expenseSchema = new Schema<IExpense>(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    vendor: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      default: "Cash",
    },
    notes: {
      type: String,
      default: "",
    },
    // Optional owner reference for auth integration
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

/* =======================
   Model Export
======================= */

const Expense: Model<IExpense> =
  (mongoose.models.Expense as Model<IExpense>) ||
  mongoose.model<IExpense>("Expense", expenseSchema);

export default Expense;

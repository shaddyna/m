import mongoose, { Document, Schema, Model } from "mongoose";

/* =======================
   Interface
======================= */

export interface IDeposit extends Document {
  source: "Boss" | "Sales" | "Other";
  amount: number;
  date: Date;
  notes?: string;
  // owner?: mongoose.Types.ObjectId; // optional for auth integration

  createdAt?: Date;
  updatedAt?: Date;
}

/* =======================
   Schema
======================= */

const depositSchema = new Schema<IDeposit>(
  {
    source: {
      type: String,
      required: true,
      enum: ["Boss", "Sales", "Other"],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

/* =======================
   Model Export
======================= */

const Deposit: Model<IDeposit> =
  (mongoose.models.Deposit as Model<IDeposit>) ||
  mongoose.model<IDeposit>("Deposit", depositSchema);

export default Deposit;

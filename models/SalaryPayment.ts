import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * 1️⃣ Interface for SalaryPayment document
 */
export interface ISalaryPayment extends Document {
  employee: mongoose.Types.ObjectId;
  month: number;
  year: number;
  basicSalary: number;
  commission: number;
  allowances: number;
  deductions: number;
  totalAmount: number;
  paymentMethod: "bank" | "mpesa" | "cash";
  paymentReference?: string;
  status: "pending" | "paid" | "failed";
  paidAt?: Date;
  processedBy?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 2️⃣ Optional static methods interface
 * (if you want any static methods, add here)
 */
export interface ISalaryPaymentModel extends Model<ISalaryPayment> {
  // Example: createForEmployee(record: any): Promise<ISalaryPayment>;
}

/**
 * 3️⃣ Schema definition
 */
const salaryPaymentSchema = new Schema<ISalaryPayment>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      default: 0,
    },
    allowances: {
      type: Number,
      default: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["bank", "mpesa", "cash"],
    },
    paymentReference: String,
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paidAt: Date,
    processedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

/**
 * 4️⃣ Indexes
 */
salaryPaymentSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });
salaryPaymentSchema.index({ status: 1 });
salaryPaymentSchema.index({ paidAt: 1 });

/**
 * 5️⃣ Model export (Next.js safe)
 */
const SalaryPayment: ISalaryPaymentModel =
  (mongoose.models.SalaryPayment as ISalaryPaymentModel) ||
  mongoose.model<ISalaryPayment, ISalaryPaymentModel>("SalaryPayment", salaryPaymentSchema);

export default SalaryPayment;

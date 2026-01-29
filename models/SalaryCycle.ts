import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * 1️⃣ Embedded SalaryEntry interface
 */
export interface ISalaryEntry extends Document {
  employee: Types.ObjectId;
  basicSalary: number;
  commission: number;
  allowances: number;
  deductions: number;
  notes?: string;
  status: "pending" | "paid";
  paidAt?: Date;
  paymentReference?: string;
}

/**
 * 2️⃣ SalaryCycle interface
 */
export interface ISalaryCycle extends Document {
  month: number;
  year: number;
  cycleName: string;
  paymentDate: Date;
  employees: ISalaryEntry[];
  status: "draft" | "processing" | "completed" | "cancelled";
  totalAmount: number;
  processedBy?: Types.ObjectId;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 3️⃣ Optional static interface (if needed later)
 */
export interface ISalaryCycleModel extends Model<ISalaryCycle> {
  // Example: createCycle(data: Partial<ISalaryCycle>): Promise<ISalaryCycle>;
}

/**
 * 4️⃣ Schemas
 */
// SalaryEntry sub-schema
const salaryEntrySchema = new Schema<ISalaryEntry>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    basicSalary: { type: Number, required: true },
    commission: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    notes: String,
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    paidAt: Date,
    paymentReference: String,
  },
  { _id: true }
);

// SalaryCycle schema
const salaryCycleSchema = new Schema<ISalaryCycle>(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    cycleName: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    employees: [salaryEntrySchema],
    status: {
      type: String,
      enum: ["draft", "processing", "completed", "cancelled"],
      default: "draft",
    },
    totalAmount: { type: Number, default: 0 },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    processedAt: Date,
  },
  { timestamps: true }
);

/**
 * 5️⃣ Pre-save middleware: calculate total
 */
salaryCycleSchema.pre<ISalaryCycle>("save", function () {
  this.totalAmount = this.employees.reduce((total, entry) => {
    return total + entry.basicSalary + entry.commission + entry.allowances - entry.deductions;
  }, 0);
});

/**
 * 6️⃣ Indexes
 */
salaryCycleSchema.index({ month: 1, year: 1 }, { unique: true });

/**
 * 7️⃣ Model export (Next.js safe)
 */
const SalaryCycle: ISalaryCycleModel =
  (mongoose.models.SalaryCycle as ISalaryCycleModel) ||
  mongoose.model<ISalaryCycle, ISalaryCycleModel>("SalaryCycle", salaryCycleSchema);

export default SalaryCycle;

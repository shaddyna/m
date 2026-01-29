import mongoose, { Document, Schema, Model, Types } from "mongoose";

/* =======================
   Interface
======================= */

export interface IBankAccount {
  accountNumber?: string;
  bankName?: string;
  branch?: string;
}

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: "manager" | "sales" | "technician" | "admin" | "driver" | "other";
  basicSalary: number;
  commissionRate?: number;
  paymentMethod: "bank" | "mpesa" | "cash";
  bankAccount?: IBankAccount;
  mpesaNumber?: string;
  status?: "active" | "inactive";
  dateJoined?: Date;
  createdBy?: Types.ObjectId;

  fullName?: string; // Virtual
  createdAt?: Date;
  updatedAt?: Date;
}

/* =======================
   Schema
======================= */

const bankAccountSchema = new Schema<IBankAccount>(
  {
    accountNumber: String,
    bankName: String,
    branch: String,
  },
  { _id: false } // prevent subdocument _id
);

const employeeSchema = new Schema<IEmployee>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    position: {
      type: String,
      required: true,
      enum: ["manager", "sales", "technician", "admin", "driver", "other"],
    },
    basicSalary: { type: Number, required: true, min: 0 },
    commissionRate: { type: Number, default: 0, min: 0, max: 100 },
    paymentMethod: { type: String, required: true, enum: ["bank", "mpesa", "cash"] },
    bankAccount: bankAccountSchema,
    mpesaNumber: String,
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    dateJoined: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

/* =======================
   Virtuals
======================= */

// fullName
employeeSchema.virtual("fullName").get(function (this: IEmployee) {
  return `${this.firstName} ${this.lastName}`;
});

/* =======================
   Model Export
======================= */

const Employee: Model<IEmployee> =
  (mongoose.models.Employee as Model<IEmployee>) ||
  mongoose.model<IEmployee>("Employee", employeeSchema);

export default Employee;

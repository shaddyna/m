import mongoose, { Schema, Document, Model, Types } from "mongoose";

/**
 * 1️⃣ Document interface
 */
export interface ITimeRecord extends Document {
  employee: Types.ObjectId;
  date: Date;
  sessionType: "check-in" | "lunch-out" | "lunch-in" | "check-out";
  recordedTime: string; // "HH:MM"
  actualTime: string;   // "HH:MM"
  status: "on-time" | "late" | "early" | "overtime";
  imageUrl: string;
  notes: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 2️⃣ Schema
 */
const timeRecordSchema = new Schema<ITimeRecord>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    sessionType: {
      type: String,
      required: true,
      enum: ["check-in", "lunch-out", "lunch-in", "check-out"],
    },
    recordedTime: {
      type: String, // "HH:MM"
      required: true,
    },
    actualTime: {
      type: String, // "HH:MM"
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["on-time", "late", "early", "overtime"],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * 3️⃣ Indexes (unchanged)
 */
timeRecordSchema.index({ employee: 1, date: 1, sessionType: 1 });
timeRecordSchema.index({ date: 1 });
timeRecordSchema.index({ department: 1 });

/**
 * 4️⃣ Next.js-safe model export
 */
const TimeRecord: Model<ITimeRecord> =
  mongoose.models.TimeRecord ||
  mongoose.model<ITimeRecord>("TimeRecord", timeRecordSchema);

export default TimeRecord;

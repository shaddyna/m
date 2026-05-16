import mongoose from 'mongoose';

export interface IAttendance {
  recordId: string;
  userId: string;
  userName: string;
  doorId: string;
  timestamp: Date;
  period: string;
  periodType: string;
  isLate: boolean;
  minutesDifference: number;
  status: string;
  verifiedBy: string;
  syncedAt: Date;
  createdAt: Date;
}

const AttendanceSchema = new mongoose.Schema<IAttendance>(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    doorId: {
      type: String,
      required: true,
      default: '1',
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    period: {
      type: String,
      required: true,
      enum: ['MorningIn', 'LunchOut', 'LunchIn', 'Departure'],
    },
    periodType: {
      type: String,
      required: true,
    },
    isLate: {
      type: Boolean,
      required: true,
      default: false,
    },
    minutesDifference: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      required: true,
    },
    verifiedBy: {
      type: String,
      required: true,
      default: 'FINGERPRINT',
    },
    syncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for unique attendance records
AttendanceSchema.index({ userId: 1, timestamp: 1, period: 1 }, { unique: true });

// Create index for date range queries
AttendanceSchema.index({ timestamp: -1 });

// Create index for user statistics
AttendanceSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.models.Attendance ||
  mongoose.model<IAttendance>('Attendance', AttendanceSchema);
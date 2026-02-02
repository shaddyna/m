import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITimeRecord extends Document {
  employee: mongoose.Types.ObjectId;
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
  workDate: string; // YYYY-MM-DD format
  date: Date;
  sessionType: 'check-in' | 'lunch-out' | 'lunch-in' | 'check-out';
  recordedTime: string;
  actualTime: string;
  status: 'on-time' | 'late' | 'early' | 'overtime';
  imageUrl?: string;
  notes?: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
}

const timeRecordSchema = new Schema<ITimeRecord>({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  employeeEmail: {
    type: String,
    required: true
  },
  employeeRole: {
    type: String,
    default: 'facilitator'
  },
  workDate: {
    type: String, // "YYYY-MM-DD"
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  sessionType: {
    type: String,
    required: true,
    enum: ['check-in', 'lunch-out', 'lunch-in', 'check-out']
  },
  recordedTime: String,
  actualTime: String,
  status: String,
  imageUrl: String,
  notes: String,
  department: {
    type: String,
    default: 'General'
  }
}, { timestamps: true });

// Indexes for efficient queries
timeRecordSchema.index({ employee: 1, workDate: 1, sessionType: 1 });
timeRecordSchema.index({ workDate: 1 });
timeRecordSchema.index({ department: 1 });
timeRecordSchema.index({ employee: 1, workDate: -1 });
timeRecordSchema.index({ status: 1, workDate: 1 });

export const TimeRecord = mongoose.models.TimeRecord || 
  mongoose.model<ITimeRecord>('TimeRecord', timeRecordSchema);

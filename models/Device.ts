import mongoose from 'mongoose';

export interface IDevice {
  deviceId: string;
  isOnline: boolean;
  lastHeartbeat: Date;
  pendingRecords: number;
  lastEventTime?: Date;
  status: 'online' | 'offline' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

const DeviceSchema = new mongoose.Schema<IDevice>(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isOnline: {
      type: Boolean,
      required: true,
      default: false,
    },
    lastHeartbeat: {
      type: Date,
      required: true,
      default: Date.now,
    },
    pendingRecords: {
      type: Number,
      required: true,
      default: 0,
    },
    lastEventTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['online', 'offline', 'error'],
      default: 'offline',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Device ||
  mongoose.model<IDevice>('Device', DeviceSchema);
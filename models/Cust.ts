import mongoose, { Schema, Document, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Enum types
type CustomerType = 'individual' | 'business' | 'school' | 'institution' | 'other';
type CustomerStatus = 'active' | 'inactive' | 'prospect' | 'suspended';
type PriorityLevel = 'low' | 'medium' | 'high' | 'vip';

export interface ICust extends Document {
  id: string;
  customerId?: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  companyName?: string;
  customerType: CustomerType;
  industry?: string;
  category?: string;
  status: CustomerStatus;
  priorityLevel: PriorityLevel;
  notes?: string;
  createdBy: string;
  lastContactDate?: Date;
  totalPurchases: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const custSchema = new Schema<ICust>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4()
    },
    customerId: {
      type: String,
      required: false,
      unique: true,
      index: true
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long']
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function(v: string): boolean {
          return /^[0-9\-\+\s\(\)]{10,15}$/.test(v);
        },
        message: 'Please enter a valid phone number'
      }
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v: string): boolean {
          return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address'
      }
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    companyName: {
      type: String,
      trim: true
    },
    customerType: {
      type: String,
      enum: {
        values: ['individual', 'business', 'school', 'institution', 'other'],
        message: '{VALUE} is not a valid customer type'
      },
      required: [true, 'Customer type is required'],
      default: 'individual'
    },
    industry: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive', 'prospect', 'suspended'],
        message: '{VALUE} is not a valid status'
      },
      required: [true, 'Status is required'],
      default: 'prospect'
    },
    priorityLevel: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'vip'],
        message: '{VALUE} is not a valid priority level'
      },
      required: [true, 'Priority level is required'],
      default: 'medium'
    },
    notes: {
      type: String,
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    },
    lastContactDate: {
      type: Date
    },
    totalPurchases: {
      type: Number,
      default: 0,
      min: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
      get: (v: number) => parseFloat(v.toFixed(2)),
      set: (v: number) => parseFloat(v.toFixed(2))
    }
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);

// Generate customer ID before saving
custSchema.pre<ICust>('save', async function() {
  if (!this.customerId) {
    const count = await (this.constructor as Model<ICust>).countDocuments();
    const prefix = 'CUST';
    const year = new Date().getFullYear().toString().slice(-2);
    const sequence = (count + 1).toString().padStart(5, '0');
    this.customerId = `${prefix}${year}${sequence}`;
  }
});

// Update timestamp on update
custSchema.pre('findOneAndUpdate', async function() {
  this.set({ updatedAt: new Date() });
});

const Cust = mongoose.model<ICust>('Cust', custSchema);

export default Cust;
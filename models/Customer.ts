import mongoose, { Schema, Document, Types } from 'mongoose';

// Sub-document interfaces
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface IContactPerson {
  name?: string;
  position?: string;
  email?: string;
  phone?: string;
}

interface IPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
}

// Enum types
type CustomerType = 'individual' | 'business' | 'corporate' | 'government';
type CustomerStatus = 'active' | 'inactive' | 'lead' | 'prospect' | 'vip';
type CustomerSource = 'referral' | 'website' | 'social_media' | 'walk_in' | 'advertisement' | 'other';

// Main Customer interface extending Mongoose Document
export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  company?: string;
  customerType: CustomerType;
  status: CustomerStatus;
  activityScore: number;
  lastActivity: Date;
  totalTransactions: number;
  totalSpent: number;
  averageTransactionValue: number;
  notes?: string;
  address: IAddress;
  contactPerson: IContactPerson;
  tags: string[];
  source: CustomerSource;
  preferences: IPreferences;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Customer schema definition
const customerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true
    },
    company: {
      type: String,
      trim: true
    },
    customerType: {
      type: String,
      enum: ['individual', 'business', 'corporate', 'government'],
      default: 'individual'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'lead', 'prospect', 'vip'],
      default: 'lead'
    },
    activityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastActivity: {
      type: Date,
      default: Date.now
    },
    totalTransactions: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    averageTransactionValue: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true
    },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String }
    },
    contactPerson: {
      name: { type: String },
      position: { type: String },
      email: { type: String },
      phone: { type: String }
    },
    tags: [{
      type: String,
      trim: true
    }],
    source: {
      type: String,
      enum: ['referral', 'website', 'social_media', 'walk_in', 'advertisement', 'other'],
      default: 'other'
    },
    preferences: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      smsNotifications: {
        type: Boolean,
        default: true
      }
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for efficient queries
customerSchema.index({ email: 1 }, { unique: true });
customerSchema.index({ status: 1 });
customerSchema.index({ customerType: 1 });
customerSchema.index({ activityScore: -1 });
customerSchema.index({ lastActivity: -1 });
customerSchema.index({ name: 'text', email: 'text', company: 'text' });

// Virtual for full address
customerSchema.virtual('fullAddress').get(function() {
  const parts: string[] = [];
  if (this.address?.street) parts.push(this.address.street);
  if (this.address?.city) parts.push(this.address.city);
  if (this.address?.state) parts.push(this.address.state);
  if (this.address?.postalCode) parts.push(this.address.postalCode);
  if (this.address?.country) parts.push(this.address.country);
  return parts.join(', ');
});

// Virtual for display name
customerSchema.virtual('displayName').get(function() {
  return this.company ? `${this.name} (${this.company})` : this.name;
});

// Pre-save middleware - SOLUTION 1: Use async without next (Recommended)
customerSchema.pre<ICustomer>('save', async function() {
  const statusScores: Record<CustomerStatus, number> = {
    'vip': 40,
    'active': 30,
    'prospect': 20,
    'lead': 10,
    'inactive': 0
  };
  
  let score = 0;
  score += statusScores[this.status] || 0;
  
  if (this.totalTransactions > 10) score += 30;
  else if (this.totalTransactions > 5) score += 20;
  else if (this.totalTransactions > 0) score += 10;
  
  const daysSinceLastActivity = (Date.now() - this.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceLastActivity < 7) score += 20;
  else if (daysSinceLastActivity < 30) score += 10;
  else if (daysSinceLastActivity < 90) score += 5;
  
  this.activityScore = Math.min(100, score);
  
  if (this.totalTransactions > 0) {
    this.averageTransactionValue = this.totalSpent / this.totalTransactions;
  }
});

// ALTERNATIVE SOLUTION 2: If you prefer using next() callback:
/*
customerSchema.pre<ICustomer>('save', function(next) {
  const statusScores: Record<CustomerStatus, number> = {
    'vip': 40,
    'active': 30,
    'prospect': 20,
    'lead': 10,
    'inactive': 0
  };
  
  let score = 0;
  score += statusScores[this.status] || 0;
  
  if (this.totalTransactions > 10) score += 30;
  else if (this.totalTransactions > 5) score += 20;
  else if (this.totalTransactions > 0) score += 10;
  
  const daysSinceLastActivity = (Date.now() - this.lastActivity.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceLastActivity < 7) score += 20;
  else if (daysSinceLastActivity < 30) score += 10;
  else if (daysSinceLastActivity < 90) score += 5;
  
  this.activityScore = Math.min(100, score);
  
  if (this.totalTransactions > 0) {
    this.averageTransactionValue = this.totalSpent / this.totalTransactions;
  }
  
  next();
});
*/

const Customer = mongoose.model<ICustomer>('Customer', customerSchema);

export default Customer;
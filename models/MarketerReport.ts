import mongoose, { Document, Schema, Model, Types } from "mongoose";

/* =======================
   Customer Visit Subdoc
======================= */

export interface ICustomerVisit {
  customerName: string;
  location: string;
  contactNumber?: string;

  visitType?: "first_visit" | "follow_up" | "demo" | "sale" | "service";
  status?: "interested" | "not_interested" | "follow_up_required" | "sold" | "pending";

  productsDiscussed?: string[];
  feedback?: string;
  issuesReported?: string;
  nextFollowUpDate?: Date;

  latitude?: number;
  longitude?: number;

  attachments?: string[];
}

const customerVisitSchema = new Schema<ICustomerVisit>(
  {
    customerName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    contactNumber: { type: String, trim: true },

    visitType: {
      type: String,
      enum: ["first_visit", "follow_up", "demo", "sale", "service"],
      default: "follow_up",
    },

    status: {
      type: String,
      enum: ["interested", "not_interested", "follow_up_required", "sold", "pending"],
      default: "pending",
    },

    productsDiscussed: [{ type: String, trim: true }],
    feedback: { type: String, trim: true },
    issuesReported: { type: String, trim: true },

    nextFollowUpDate: Date,

    latitude: Number,
    longitude: Number,

    attachments: [String],
  },
  { _id: false }
);

/* =======================
   Main Report Interface
======================= */

export interface IMarketerReport extends Document {
  marketer: Types.ObjectId;
  date: Date;

  title: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm

  totalDistance?: number;
  transportationMode?: "walking" | "bicycle" | "motorcycle" | "car" | "public_transport";
  transportationCost?: number;

  customerVisits: ICustomerVisit[];

  leadsGenerated?: number;
  salesMade?: number;
  salesAmount?: number;

  challenges?: string;
  achievements?: string;
  recommendations?: string;
  resourcesNeeded?: string;
  overallFeedback?: string;

  status?: "draft" | "submitted" | "reviewed" | "approved" | "rejected";

  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  reviewComments?: string;

  locationData?: {
    startLocation?: {
      latitude?: number;
      longitude?: number;
      address?: string;
    };
    endLocation?: {
      latitude?: number;
      longitude?: number;
      address?: string;
    };
    routePoints?: {
      latitude?: number;
      longitude?: number;
      timestamp?: Date;
    }[];
  };

  submittedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;

  /* Virtuals */
  totalVisits?: number;
  totalHours?: string;
  efficiencyScore?: number;
}

type MarketerReportModel = Model<IMarketerReport>;

/* =======================
   Schema
======================= */

const marketerReportSchema = new Schema<IMarketerReport>(
  {
    marketer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    totalDistance: { type: Number, default: 0 },

    transportationMode: {
      type: String,
      enum: ["walking", "bicycle", "motorcycle", "car", "public_transport"],
      default: "walking",
    },

    transportationCost: { type: Number, default: 0 },

    customerVisits: [customerVisitSchema],

    leadsGenerated: { type: Number, default: 0 },
    salesMade: { type: Number, default: 0 },
    salesAmount: { type: Number, default: 0 },

    challenges: { type: String, trim: true },
    achievements: { type: String, trim: true },
    recommendations: { type: String, trim: true },
    resourcesNeeded: { type: String, trim: true },
    overallFeedback: { type: String, trim: true },

    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed", "approved", "rejected"],
      default: "draft",
    },

    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: Date,
    reviewComments: { type: String, trim: true },

    locationData: {
      startLocation: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
      endLocation: {
        latitude: Number,
        longitude: Number,
        address: String,
      },
      routePoints: [
        {
          latitude: Number,
          longitude: Number,
          timestamp: Date,
        },
      ],
    },

    submittedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* =======================
   Indexes
======================= */

marketerReportSchema.index({ marketer: 1, date: -1 });
marketerReportSchema.index({ date: 1 });
marketerReportSchema.index({ status: 1 });
marketerReportSchema.index({ "customerVisits.status": 1 });
marketerReportSchema.index({ "customerVisits.nextFollowUpDate": 1 });

/* =======================
   Virtuals
======================= */

marketerReportSchema.virtual("totalVisits").get(function (this: IMarketerReport) {
  return this.customerVisits.length;
});

marketerReportSchema.virtual("totalHours").get(function (this: IMarketerReport) {
  const [sh, sm] = this.startTime.split(":").map(Number);
  const [eh, em] = this.endTime.split(":").map(Number);

  let diff = eh * 60 + em - (sh * 60 + sm);
  if (diff < 0) diff += 24 * 60;

  return (diff / 60).toFixed(2);
});

marketerReportSchema.virtual("efficiencyScore").get(function (this: IMarketerReport) {
  let score = 0;

  score += Math.min(this.totalVisits! * 5, 50);
  score += Math.min(this.salesMade! * 10, 30);
  score += Math.min(this.leadsGenerated! * 2, 20);

  if (this.challenges && this.challenges.length > 50) {
    score -= 10;
  }

  return Math.min(Math.max(score, 0), 100);
});

/* =======================
   Pre-save Hook (TS-safe)
======================= */

marketerReportSchema.pre<IMarketerReport>("save", async function () {
  if (this.isModified("customerVisits")) {
    this.leadsGenerated = this.customerVisits.filter(
      v => v.status === "interested" || v.status === "follow_up_required"
    ).length;
  }

  if (this.isModified("status") && this.status === "submitted" && !this.submittedAt) {
    this.submittedAt = new Date();
  }
});

/* =======================
   Model Export
======================= */

const MarketerReport =
  (mongoose.models.MarketerReport as MarketerReportModel) ||
  mongoose.model<IMarketerReport, MarketerReportModel>(
    "MarketerReport",
    marketerReportSchema
  );

export default MarketerReport;

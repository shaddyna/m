import mongoose, { Document, Schema, Model } from "mongoose";

/* 1. Document interface */
export interface IMarketingReport extends Document {
  id: string;
  reportTitle: string;

  date: Date;
  startTime: Date;
  endTime: Date;

  transportMode:
    | "personal_car"
    | "public_transport"
    | "company_car"
    | "motorcycle"
    | "walking"
    | "other";

  transportCost: number;
  totalDistance: number;

  startingPoint: string;
  endingPoint: string;

  salesMade: string;
  challengesFaced: string;
  achievements: string;
  recommendations: string;
  resourcesNeeded: string;
  overallFeedback: string;

  marketerName: string;

  status?: "draft" | "submitted" | "reviewed" | "approved";

  createdAt?: Date;
  updatedAt?: Date;
}

/* 2. Model type */
type MarketingReportModel = Model<IMarketingReport>;

/* 3. Schema */
const marketingReportSchema = new Schema<IMarketingReport>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    reportTitle: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    transportMode: {
      type: String,
      enum: [
        "personal_car",
        "public_transport",
        "company_car",
        "motorcycle",
        "walking",
        "other",
      ],
      required: true,
    },

    transportCost: {
      type: Number,
      required: true,
      min: 0,
    },

    totalDistance: {
      type: Number,
      required: true,
      min: 0,
    },

    startingPoint: {
      type: String,
      required: true,
    },

    endingPoint: {
      type: String,
      required: true,
    },

    salesMade: {
      type: String,
      required: true,
    },

    challengesFaced: {
      type: String,
      required: true,
    },

    achievements: {
      type: String,
      required: true,
    },

    recommendations: {
      type: String,
      required: true,
    },

    resourcesNeeded: {
      type: String,
      required: true,
    },

    overallFeedback: {
      type: String,
      required: true,
    },

    marketerName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "reviewed", "approved"],
      default: "draft",
    },
  },
  { timestamps: true }
);

/* 4. Model export (hot-reload safe) */
const MarketingReport =
  (mongoose.models.MarketingReport as MarketingReportModel) ||
  mongoose.model<IMarketingReport, MarketingReportModel>(
    "MarketingReport",
    marketingReportSchema
  );

export default MarketingReport;

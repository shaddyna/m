import mongoose, { Document, Schema, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

/* =======================
   Interface
======================= */

export interface IInventoryMovement extends Document {
  id: string;

  itemId: string;
  itemCode: string;
  itemName: string;

  movementDate: Date;

  movementType: "in" | "out" | "adjustment" | "transfer" | "return";

  quantity: number;
  previousQuantity: number;
  newQuantity: number;

  reason: string;
  responsiblePerson: string;

  referenceNumber?: string;
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

type InventoryMovementModel = Model<IInventoryMovement>;

/* =======================
   Schema
======================= */

const inventoryMovementSchema = new Schema<IInventoryMovement>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },

    itemId: {
      type: String,
      required: true,
      ref: "Inventory",
    },

    itemCode: {
      type: String,
      required: true,
    },

    itemName: {
      type: String,
      required: true,
    },

    movementDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    movementType: {
      type: String,
      required: true,
      enum: ["in", "out", "adjustment", "transfer", "return"],
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    previousQuantity: {
      type: Number,
      required: true,
    },

    newQuantity: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    responsiblePerson: {
      type: String,
      required: true,
      trim: true,
    },

    referenceNumber: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

/* =======================
   Pre-save Hook (TS-safe)
======================= */

inventoryMovementSchema.pre<IInventoryMovement>("save", async function () {
  if (!this.referenceNumber) {
    const count = await (this.constructor as InventoryMovementModel).countDocuments();

    const prefix = "MOV";
    const year = new Date().getFullYear().toString().slice(-2);
    const month = (new Date().getMonth() + 1).toString().padStart(2, "0");
    const sequence = (count + 1).toString().padStart(4, "0");

    this.referenceNumber = `${prefix}${year}${month}${sequence}`;
  }
});

/* =======================
   Model Export
======================= */

const InventoryMovement =
  (mongoose.models.InventoryMovement as InventoryMovementModel) ||
  mongoose.model<IInventoryMovement, InventoryMovementModel>(
    "InventoryMovement",
    inventoryMovementSchema
  );

export default InventoryMovement;

import mongoose, { Document, Schema, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

/* =======================
   Interface
======================= */

export interface IInventory extends Document {
  id: string;

  itemCode: string;
  itemName: string;
  category: string;
  description?: string;

  unitOfMeasure:
    | "piece"
    | "box"
    | "kg"
    | "liter"
    | "meter"
    | "pack"
    | "carton"
    | "bottle"
    | "bag";

  brand?: string;

  currentQuantity: number;
  minStockLevel: number;
  maxStockLevel?: number;

  costPrice: number;
  sellingPrice: number;

  hasDiscount?: boolean;
  discountPrice?: number;

  warehouseName: string;
  shelfLocation?: string;

  supplierName?: string;
  supplierContact?: string;

  lastPurchaseDate?: Date;
  lastPurchasePrice?: number;

  status?: "in_stock" | "low_stock" | "out_of_stock" | "discontinued";

  totalValue?: number;
  notes?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

type InventoryModel = Model<IInventory>;

/* =======================
   Schema
======================= */

const inventorySchema = new Schema<IInventory>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => uuidv4(),
    },

    itemCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    itemName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    unitOfMeasure: {
      type: String,
      enum: ["piece", "box", "kg", "liter", "meter", "pack", "carton", "bottle", "bag"],
      default: "piece",
      required: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    currentQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    minStockLevel: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },

    maxStockLevel: {
      type: Number,
      min: 0,
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0,
      get: (v: number) => Number(v?.toFixed(2)),
      set: (v: number) => Number(v?.toFixed(2)),
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
      get: (v: number) => Number(v?.toFixed(2)),
      set: (v: number) => Number(v?.toFixed(2)),
    },

    hasDiscount: {
      type: Boolean,
      default: false,
    },

    discountPrice: {
      type: Number,
      min: 0,
      get: (v: number) => Number(v?.toFixed(2)),
      set: (v: number) => Number(v?.toFixed(2)),
    },

    warehouseName: {
      type: String,
      required: true,
      trim: true,
    },

    shelfLocation: {
      type: String,
      trim: true,
    },

    supplierName: {
      type: String,
      trim: true,
    },

    supplierContact: {
      type: String,
      trim: true,
    },

    lastPurchaseDate: Date,

    lastPurchasePrice: {
      type: Number,
      min: 0,
      get: (v: number) => Number(v?.toFixed(2)),
      set: (v: number) => Number(v?.toFixed(2)),
    },

    status: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock", "discontinued"],
      default: "in_stock",
    },

    totalValue: {
      type: Number,
      min: 0,
      default: 0,
      get: (v: number) => Number(v?.toFixed(2)),
      set: (v: number) => Number(v?.toFixed(2)),
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

/* =======================
   Pre-save Hook (TS-safe)
======================= */

inventorySchema.pre<IInventory>("save", async function () {
  if (this.currentQuantity <= 0) {
    this.status = "out_of_stock";
  } else if (this.currentQuantity <= this.minStockLevel) {
    this.status = "low_stock";
  } else {
    this.status = "in_stock";
  }

  this.totalValue = Number((this.currentQuantity * this.costPrice).toFixed(2));
});

/* =======================
   Pre-update Hook (TS-safe)
======================= */

inventorySchema.pre("findOneAndUpdate", async function () {
  const update: any = this.getUpdate() || {};
  const $set = update.$set || (update.$set = {});

  if ($set.currentQuantity !== undefined) {
    const qty = $set.currentQuantity;
    const minLevel = $set.minStockLevel ?? this.get("minStockLevel");

    if (qty <= 0) {
      $set.status = "out_of_stock";
    } else if (minLevel !== undefined && qty <= minLevel) {
      $set.status = "low_stock";
    } else {
      $set.status = "in_stock";
    }

    if ($set.costPrice !== undefined) {
      $set.totalValue = Number((qty * $set.costPrice).toFixed(2));
    }
  }

  $set.updatedAt = new Date();
});

/* =======================
   Model Export
======================= */

const Inventory =
  (mongoose.models.Inventory as InventoryModel) ||
  mongoose.model<IInventory, InventoryModel>("Inventory", inventorySchema);

export default Inventory;

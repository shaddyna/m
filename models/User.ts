import mongoose, { Schema, Document, Model } from "mongoose";
import jwt from "jsonwebtoken";

/**
 * 1️⃣ Define the User document shape
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "storeManager" | "facilitator" | "sales" | "accounts";
  tokens: { token: string }[];
  generateAuthToken(): Promise<string>;
}

/**
 * 2️⃣ Define the schema
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "storeManager", "facilitator", "sales", "accounts"],
      default: "facilitator",
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

/**
 * 3️⃣ Normalize role before validation
 */
userSchema.pre<IUser>("validate", function () {
  if (this.role) {
    this.role = this.role
      .toLowerCase()
      .replace("storemanager", "storeManager") as IUser["role"];
  }
});

/**
 * 4️⃣ Instance method
 */
userSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this as IUser;

  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET || "your-secret-key"
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

/**
 * 5️⃣ Prevent model overwrite in Next.js (VERY IMPORTANT)
 */
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
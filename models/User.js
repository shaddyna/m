import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 7, trim: true },
    role: { type: String, enum: ["admin","storeManager","facilitator","sales","accounts"], default: "facilitator", required: true },
    tokens: [{ token: { type: String, required: true } }],
  },
  { timestamps: true }
);

// ✅ Only one pre hook
userSchema.pre("validate", async function () {
  if (this.role) {
    this.role = this.role
      .toLowerCase()
      .replace("storemanager", "storeManager");
  }
});

// Generate JWT token
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.JWT_SECRET || "your-secret-key"
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// Prevent model overwrite in Next.js
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
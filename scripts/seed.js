import dotenv from "dotenv";
dotenv.config();

import connectDB from "../lib/db.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const seedUsers = async () => {
  try {
    await connectDB();

    console.log("Connected to DB...");

    // Optional: clear existing users
    await User.deleteMany();
    console.log("Old users removed");

    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "admin",
      },
      {
        name: "Store Manager",
        email: "manager@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "storeManager",
      },
      {
        name: "Sales Person",
        email: "sales@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "sales",
      },
      {
        name: "Accounts",
        email: "accounts@example.com",
        password: await bcrypt.hash("password123", 10),
        role: "accounts",
      },
    ];

    const createdUsers = await User.insertMany(users);

    console.log("Users seeded successfully:");
    console.log(createdUsers);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
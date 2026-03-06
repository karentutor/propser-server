import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import { User } from "../models/User";

dotenv.config();

async function seedUser() {
  try {
    await connectDB();

    const email = "test@test.com";
    const plainPassword = "Password123!";
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName: "Prosper",
      lastName: "User",
      isActive: true,
    });

    console.log("Seed user created:");
    console.log({
      id: user._id.toString(),
      email: user.email,
      password: plainPassword,
    });

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedUser();
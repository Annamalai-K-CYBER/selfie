import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// 🔗 Connect MongoDB
async function connectDB() {
  if (mongoose.connection.readyState !== 0) return;

  if (!process.env.MONGODB_URI) {
    console.error("❌ Missing MONGODB_URI in .env.local");
    throw new Error("MongoDB URI missing");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "selfie",
    });
    console.log("✅ MongoDB connected (register)");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}

// 🧩 Schema
const userSchema = new mongoose.Schema(
  {
    username: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

// 📨 POST /api/register
export async function POST(req) {
  try {
    await connectDB();

    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashed,
      role: role || "user",
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Registration error:", err);
    return NextResponse.json(
      { success: false, message: "Registration failed", error: err.message },
      { status: 500 }
    );
  }
}

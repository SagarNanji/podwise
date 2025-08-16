import { Router } from "express";
import bcrypt from "bcryptjs";
import { getDb } from "../utils/db";
import { User } from "../models/User";

import { Request } from "express";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      name: string;
    };
  }
}

const router = Router();

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const db = getDb();
    const users = db.collection<User>("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    // Save user info in session
    req.session.user = {
      id: result.insertedId.toString(),
      email,
      name,
    };

    res.status(201).json({ message: "Signup successful", user: req.session.user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Sign In
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = getDb();
    const users = db.collection<User>("users");

    const user = await users.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Save in session
    req.session.user = {
      id: user._id?.toString() || "",
      email: user.email,
      name: user.name,
    };

    res.json({ message: "Signin successful", user: req.session.user });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Sign Out
router.post("/signout", (req, res) => {
  req.session.destroy((err: any) => {
    if (err) return res.status(500).json({ error: "Could not log out" });
    res.json({ message: "Signout successful" });
  });
});

export default router;

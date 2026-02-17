import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const ACCESS_EXPIRE = "15m";
const REFRESH_EXPIRE = "7d";

export const generateTokens = (user: any) => {
  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    { expiresIn: ACCESS_EXPIRE }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: REFRESH_EXPIRE }
  );

  return { accessToken, refreshToken };
};


export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, password, phone } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      email,
      phone,
      password: hashed,
      role: "user",
    });

    const { accessToken, refreshToken } = generateTokens(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(201)
      .json({
        accessToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Signup failed" });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({
        accessToken,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};


export const refresh = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.sendStatus(401);

  jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET as string,
    (err: any, decoded: any) => {
      if (err) return res.sendStatus(403);

      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

export const logout = (_req: Request, res: Response) => {
  res
    .clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    })
    .status(200)
    .json({ message: "Logged out successfully" });
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { fullName, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;

    await user.save();

    res.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// ========================
// GET ALL USERS (Admin)
// ========================
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude password field
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch all users" });
  }
};


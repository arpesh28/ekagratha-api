import { Request, Response } from "express";
import { User } from "../models/User.model";
import { bcryptPassword, comparePasswords } from "../config/helpers";
import jwt from "jsonwebtoken";
import axios from "axios";

// Local Register
const registerController = async (req: Request, res: Response) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) return res.json({ message: "Email already exists!" });

  const hashPassword = bcryptPassword(req.body.password);
  const user = await User.create({
    name: req.body.name,
    password: hashPassword,
    email: req.body.email,
  });

  if (!user) return res.json({ message: "Something went wrong" });

  const token = jwt.sign(
    { name: user.name, email: user.email },
    process.env.JWT_SECRET!
  );
  res.json({
    data: {
      user: { email: user.email, _id: user._id, name: user.name },
      token,
    },
  });
};

// Local Login
const loginController = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(401).json({ message: "Email not found!" });

  const validPass: boolean = await comparePasswords(
    req.body.password,
    user.password
  );
  if (!validPass)
    return res.status(401).json({ message: "Email/Password is incorrect" });

  const token = jwt.sign(
    { email: user.email, name: user.name },
    process.env.JWT_SECRET!
  );

  res.json({
    data: {
      user: { email: user.email, name: user.name, _id: user._id },
      token,
    },
  });
};

// Get Google Auth URL
const googleAuthGetURLController = async (req: Request, res: Response) => {
  // URL with client ID and redirect url for frontend
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&scope=email%20profile`;

  res.json({ data: authUrl });
};

// Verify google code and save the user profile
const googleAuthCallbackController = async (req: Request, res: Response) => {
  const { code } = req.query; // Get code from the front end

  // Validate google authentication code
  if (!code)
    res.status(400).json({ message: "Google Authorization Code is required!" });

  try {
    // Exchange code for token from google
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    // Use the access token and fetch user profile
    const accessToken = tokenResponse?.data?.access_token;
    const profileResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const userProfile = profileResponse.data; // User profile that will be stored in the DB

    res.json({ tokenResponse: tokenResponse?.data, userProfile });
  } catch (error: any) {
    console.error("Error exchanging code for token:", error?.response?.data);
    res
      .status(500)
      .json({ message: "Failed to authenticate with Google", error });
  }
};

export {
  registerController,
  loginController,
  googleAuthGetURLController,
  googleAuthCallbackController,
};

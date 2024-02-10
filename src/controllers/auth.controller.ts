import { Request, Response } from "express";
import { User } from "../models/User.model";
import { bcryptPassword, comparePasswords } from "../config/helpers";
import jwt from "jsonwebtoken";
import axios from "axios";
import { Providers } from "../typings/enum";
import { errorMessages } from "../constants/messages";
import { ProviderUserProfile } from "../typings/types";

// Local Register
const registerController = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists!" });

    const hashPassword = bcryptPassword(req.body.password);
    const user = await User.create({
      name: req.body.name,
      password: hashPassword,
      email: req.body.email,
    });

    if (!user)
      return res.status(500).json({ message: errorMessages.SOMETHING_WRONG });

    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.JWT_SECRET!
    );
    res.json({
      data: {
        user: {
          email: user.email,
          _id: user._id,
          name: user.name,
          provider: user.provider,
        },
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: errorMessages.SOMETHING_WRONG });
  }
};

// Local Login
const loginController = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(401).json({ message: errorMessages.EMAIL_NOT_FOUND });

    if (user.provider !== Providers.Email || !user.password)
      return res
        .status(400)
        .json({ message: errorMessages.EMAIL_REGISTERED_WITH_OTHER_PROVIDER });

    const validPass: boolean = await comparePasswords(
      req.body.password,
      user.password
    );
    if (!validPass)
      return res
        .status(401)
        .json({ message: errorMessages.INVALID_CREDENTIALS });

    const token = jwt.sign(
      { email: user.email, name: user.name },
      process.env.JWT_SECRET!
    );

    res.json({
      data: {
        user: {
          email: user.email,
          name: user.name,
          _id: user._id,
          provider: user.provider,
        },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: errorMessages.SOMETHING_WRONG });
  }
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
    res.status(400).json({ message: errorMessages.GOOGLE_CODE_MISSING });

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
    const userProfile: ProviderUserProfile = profileResponse.data; // User profile that will be stored in the DB

    const existingUser = await User.findOne({ email: userProfile?.email });

    if (existingUser) {
      if (existingUser.provider !== Providers.Google)
        return res.status(400).json({
          message: errorMessages.EMAIL_REGISTERED_WITH_OTHER_PROVIDER,
        });

      if (existingUser.providerUserId !== userProfile.sub) {
        return res.status(401).json({
          message: errorMessages.UNKNOWN_SUBSCRIBER_ID,
        });
      }
      const token = jwt.sign(
        {
          email: existingUser.email,
          name: existingUser.name,
          _id: existingUser._id,
        },
        process.env.JWT_SECRET!
      );
      return res.json({
        data: {
          user: {
            email: existingUser.email,
            name: existingUser.name,
            _id: existingUser._id,
            provider: existingUser.provider,
          },
          token,
        },
      });
    }

    const newUser = await User.create({
      email: userProfile.email,
      name: userProfile.name,
      providerUserId: userProfile.sub,
      provider: Providers.Google,
    });

    if (!newUser)
      return res.status(500).json({
        message: errorMessages.SOMETHING_WRONG,
      });

    const token = jwt.sign(
      {
        email: newUser.email,
        name: newUser.name,
        _id: newUser._id,
        provider: newUser.provider,
      },
      process.env.JWT_SECRET!
    );

    res.json({
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error: any) {
    console.error("Error exchanging code for token:", error?.response?.data);
    res.status(500).json({ message: errorMessages.GOOGLE_AUTH_FAILED });
  }
};

export {
  registerController,
  loginController,
  googleAuthGetURLController,
  googleAuthCallbackController,
};

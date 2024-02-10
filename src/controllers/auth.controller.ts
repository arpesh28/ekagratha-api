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

// Verify google code and save the user profile to DB
const googleAuthCallbackController = async (req: Request, res: Response) => {
  const { code } = req.query; // Get code from the front end

  // Validate google authentication code
  if (!code)
    return res.status(400).json({ message: errorMessages.GOOGLE_CODE_MISSING });

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

    // Fetch user data using the access token
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

    // Validate if user email already exists in the DB
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
          provider: existingUser.provider,
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

// Get Discord Auth URL
const discordAuthGetURLController = async (req: Request, res: Response) => {
  // URL with client ID and redirect url for frontend
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${process.env.DISCORD_REDIRECT_URI}&scope=identify+email`;

  res.json({ data: authUrl });
};

//  Verify Discord code and save the user profile to DB
const discordAuthCallbackController = async (req: Request, res: Response) => {
  const { code } = req.query; // Get code from the front end

  // Validate discord authentication code
  if (!code)
    return res
      .status(400)
      .json({ message: errorMessages.DISCORD_CODE_MISSING });

  try {
    // Exchange code for token from discord
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
        scope: "identify email",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Fetch user data using the access token
    const accessToken = tokenResponse?.data?.access_token;
    const profileResponse = await axios.get(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Validate if user email already exists in the DB
    const userProfile: ProviderUserProfile = profileResponse.data; // User profile that will be stored in the DB

    // Validate if user email already exists in the DB
    const existingUser = await User.findOne({ email: userProfile?.email });

    if (existingUser) {
      if (existingUser.provider !== Providers.Discord)
        return res.status(400).json({
          message: errorMessages.EMAIL_REGISTERED_WITH_OTHER_PROVIDER,
        });

      if (existingUser.providerUserId !== userProfile.id) {
        return res.status(401).json({
          message: errorMessages.UNKNOWN_SUBSCRIBER_ID,
        });
      }
      const token = jwt.sign(
        {
          email: existingUser.email,
          name: existingUser.name,
          _id: existingUser._id,
          provider: existingUser.provider,
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
            providerUserId: existingUser.providerUserId,
          },
          token,
        },
      });
    }
    const newUser = await User.create({
      email: userProfile.email,
      name: userProfile.username,
      providerUserId: userProfile.id,
      provider: Providers.Discord,
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
    res.status(500).json({ message: errorMessages.DISCORD_AUTH_FAILED });
  }
};

// Get Github Auth URL
const githubAuthGetURLController = async (req: Request, res: Response) => {
  // URL with client ID and redirect url for frontend
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=user+email`;

  res.json({ data: authUrl });
};

//  Verify Github code and save the user profile to DB
const githubAuthCallbackController = async (req: Request, res: Response) => {
  const { code } = req.query; // Get code from the front end

  // Validate github authentication code
  if (!code)
    return res.status(400).json({ message: errorMessages.GITHUB_CODE_MISSING });

  try {
    // Exchange code for token from github
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
        scope: "read:user",
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    // Fetch user data using the access token
    const accessToken = tokenResponse?.data?.access_token;
    const profileResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Fetch user's private email address using the access token
    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Accept: "/",
          "Accept-Encoding": "gzip, deflate, br",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const userProfile: ProviderUserProfile = profileResponse.data; // User profile that will be stored in the DB
    const userEmail: string = emailResponse?.data?.[0]?.email; // User profile that will be stored in the DB

    // // Validate if user email already exists in the DB
    const existingUser = await User.findOne({ email: userEmail });

    if (existingUser) {
      if (existingUser.provider !== Providers.Github)
        return res.status(400).json({
          message: errorMessages.EMAIL_REGISTERED_WITH_OTHER_PROVIDER,
        });
      if (existingUser.providerUserId !== userProfile.id) {
        return res.status(401).json({
          message: errorMessages.UNKNOWN_SUBSCRIBER_ID,
        });
      }
      const token = jwt.sign(
        {
          email: existingUser.email,
          name: existingUser.name,
          _id: existingUser._id,
          provider: existingUser.provider,
          providerUserId: existingUser.providerUserId,
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
      email: userEmail,
      name: userProfile.name,
      providerUserId: userProfile.id,
      provider: Providers.Github,
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
    res.status(500).json({ message: errorMessages.GITHUB_AUTH_FAILED });
  }
};

export {
  // Email
  registerController,
  loginController,
  // Google
  googleAuthGetURLController,
  googleAuthCallbackController,
  // Discord
  discordAuthGetURLController,
  discordAuthCallbackController,
  // Github
  githubAuthGetURLController,
  githubAuthCallbackController,
};

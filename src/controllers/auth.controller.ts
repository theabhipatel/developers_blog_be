import userModel, { EProvider } from "@/models/user.model";
import userProfileModel from "@/models/userProfile.model";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config";
import { sendEMail } from "@/utils/sendEMail";

export const singupHandler: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      res.status(403).json({ success: false, message: "User already registered." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      provider: EProvider.CREDENTIALS,
    });
    await userProfileModel.create({
      user: newUser._id,
      firstName,
      lastName,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "2m",
    });

    const testMessageUrl = await sendEMail({
      mailTo: email,
      subject: "Email for verification",
      html: `<h1>Hello ${firstName}, </h1> <p> please verify your email. <br/> this is verification token : ${token} </p>`,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully, Please verify your email.",
      testMessageUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const signinHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credantials." });
      return;
    }
    if (!user.isVerified) {
      res
        .status(401)
        .json({ success: false, message: "Email not verified. Please verify your email first." });
      return;
    }
    if (user.isBlocked) {
      res.status(401).json({ success: false, message: "User is blocked." });
      return;
    }
    if (user.isDeleted) {
      res.status(403).json({ success: false, message: "This account is deleted." });
      return;
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      res.status(401).json({ success: false, message: "Invalid credantials." });
      return;
    }

    const userProfile = await userProfileModel
      .findOne({ user: user._id })
      .select("firstName lastName profilePic")
      .lean();

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      user: { ...userProfile, email, role: user.role, _id: user._id },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const oAuthSigninHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, firstName, lastName, profilePic, provider } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      if (user.isBlocked) {
        res.status(401).json({ success: false, message: "User is blocked." });
        return;
      }
      if (user.isDeleted) {
        res.status(403).json({ success: false, message: "This account is deleted." });
        return;
      }

      if (user.provider !== provider) {
        res
          .status(401)
          .json({ success: false, message: "User cannot login with these credentials." });
        return;
      }

      const userProfile = await userProfileModel
        .findOne({ user: user._id })
        .select("firstName lastName profilePic")
        .lean();

      const accessToken = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

      res.status(200).json({
        success: true,
        message: "User logged in successfully.",
        user: { ...userProfile, email, role: user.role, _id: user._id },
        accessToken,
      });
    } else {
      const newUser = await userModel.create({
        email,
        provider,
        isVerified: true,
      });
      await userProfileModel.create({
        user: newUser._id,
        firstName,
        lastName,
        profilePic,
      });

      const accessToken = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET);

      res.status(200).json({
        success: true,
        message: "User logged in successfully.",
        user: { _id: newUser._id, firstName, lastName, profilePic, email, role: newUser.role },
        accessToken,
      });
    }
  } catch (error) {
    next(error);
  }
};

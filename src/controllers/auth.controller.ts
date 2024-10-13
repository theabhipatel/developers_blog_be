import userModel, { EProvider } from "@/models/user.model";
import userProfileModel from "@/models/userProfile.model";
import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config";
import { sendEMail } from "@/utils/sendEMail";

// @ts-expect-error [.] will fix type error later
export const singupHandler: RequestHandler = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) return res.status(403).json({ success: false, message: "User already registered." });

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

    return res.status(201).json({
      success: true,
      message: "User registered successfully, Please verify your email.",
      testMessageUrl,
    });
  } catch (error) {
    next(error);
  }
};

// @ts-expect-error [.] will fix type error later
export const signinHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credantials." });
    if (!user.isVerified)
      return res.status(401).json({ success: false, message: "Email not verified." });
    if (user.isBlocked)
      return res.status(401).json({ success: false, message: "User is blocked." });
    if (user.isDeleted)
      return res.status(403).json({ success: false, message: "This account is deleted." });

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return res.status(401).json({ success: false, message: "Invalid credantials." });

    const userProfile = await userProfileModel
      .findOne({ user: user._id })
      .select("firstName lastName profilePic")
      .lean();

    const accessToken = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "User logged in successfully.",
      user: { ...userProfile, email },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const oAuthSigninHandler: RequestHandler = async (req, res, next) => {
  try {
    // const { email, password } = req.body;
    console.log("oauth req.body --->", req.body); // eslint-disable-line

    // const user = await userModel.findOne({ email });
    // if (!user) return res.status(401).json({ success: false, message: "Invalid credantials." });
    // if (!user.isVerified)
    //   return res.status(401).json({ success: false, message: "Email not verified." });
    // if (user.isBlocked)
    //   return res.status(401).json({ success: false, message: "User is blocked." });
    // if (user.isDeleted)
    //   return res.status(403).json({ success: false, message: "This account is deleted." });

    // const isPasswordMatched = await bcrypt.compare(password, user.password);
    // if (!isPasswordMatched)
    //   return res.status(401).json({ success: false, message: "Invalid credantials." });

    // const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    // res.status(200).json({ success: true, message: "User logged in successfully.", token });

    res.status(200).json({ success: true, message: "User logged in successfully." });
  } catch (error) {
    next(error);
  }
};

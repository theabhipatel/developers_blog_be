import userModel from "@/models/user.model";
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
    if (user) return res.status(403).json({ success: false, message: "User already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      email,
      password: hashedPassword,
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

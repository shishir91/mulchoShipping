import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import orderModel from "../models/orderModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import generateToken from "../config/generateToken.js";
import DatauriParser from "datauri/parser.js";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export default class UserController {
  async register(req, res) {
    try {
      const { name, email, password, confirm_password } = req.body;
      console.log(req.body);

      if (!name || !email || !password || !confirm_password) {
        return res.json({ success: false, message: "All fields are required" });
      }
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Invalid email address" });
      }

      const existingEmail = await userModel.findOne({ email });
      if (existingEmail) {
        return res.json({
          success: false,
          message: "User already exists with this email address",
        });
      }

      if (password === confirm_password) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        let newUser = await userModel.create({
          name,
          email,
          password: hashedPassword,
        });
        console.log(newUser);
        newUser = await userModel.findById(newUser._id).select("-password");
        console.log(newUser);
        res.status(200).json({
          success: true,
          message: "User Registered Successful",
          userData: newUser,
          token: generateToken(newUser._id),
        });
      } else {
        return res.json({ success: false, message: "Password didn't match" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({ success: false, message: "All fields are required" });
      }

      let user = await userModel.findOne({ email });
      if (!user) {
        return res.json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.json({
          success: false,
          message: "Invalid email or password",
        });
      }

      user = await userModel.findById(user._id).select("-password -otp");

      res.status(200).json({
        success: true,
        message: "Login Successful",
        userData: user,
        token: generateToken(user._id),
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  async getMyData(req, res) {
    try {
      const data = await userModel
        .findById(req.user.id)
        .select("-password -otp");
      if (data) {
        res.json({ success: true, data });
      }
    } catch (e) {
      return res.status(400).send(e);
    }
  }

  async kyc(req, res) {
    try {
      const { referedby } = req.body;
      console.log("Body: ", req.body);
      console.log("referedBy: ", referedby);
      if (referedby && !mongoose.Types.ObjectId.isValid(referedby)) {
        return res.json({ success: false, message: "Invalid referral ID." });
      }
      const user = await userModel.findById(req.user.id);
      if (user.isEmailVerified) {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const parser = new DatauriParser();

        const uploadToCloudinary = async (file) => {
          // Get the extension
          const ext = path.extname(file.originalname).toString();
          const dataUri = parser.format(ext, file.buffer);

          const result = await cloudinary.uploader.upload(dataUri.content);
          return result;
        };

        // Usage:
        const result = await uploadToCloudinary(req.file);
        // console.log("Cloudinary result:", result);

        const verifyUser = await userModel.findByIdAndUpdate(
          req.user.id,
          {
            ...req.body,
            payment: result.secure_url,
            status: "underReview",
          },
          { new: true }
        );
        if (verifyUser) {
          let data = await userModel
            .findById(req.user.id)
            .select("-password -otp");
          res.json({
            success: true,
            message: "User Verification Successfull",
            data,
          });
        } else {
          res.json({ success: false, message: "User Verification failed" });
        }
      } else {
        res.json({ success: false, message: "Email is not verified" });
      }
    } catch (e) {
      console.log(e);
      return res.status(400).send(e);
    }
  }

  async getIncome(req, res) {
    try {
      // const income = await transactionModel
      //   .find({ to: req.user._id })
      //   .populate([
      //     { path: "to", select: "-password -otp" },
      //     {
      //       path: "source",
      //       populate: { path: "product" },
      //     },
      //   ]);
      const income = await orderModel
        .find({
          orderFrom: req.user._id,
          status: { $in: ["delivered", "exchanged"] },
        })
        .populate("product");

      res.json({ success: true, income });
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

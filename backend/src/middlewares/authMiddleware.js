import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export default async (req, res, next) => {
  let token = req.headers.token;

  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ success: false, message: "Invalid Token" });
        }
        console.log("Token Valid");
        console.log(decoded);
        console.log(decoded.id);
        req.user = await userModel.findById(decoded.id).select("-password");
        next();
      });
    } catch (error) {
      res
        .status(401)
        .json({ success: false, message: "Token Verification Failed" });
    }
  } else {
    res.status(401).json({ success: false, message: "Token Not Provided" });
  }
};

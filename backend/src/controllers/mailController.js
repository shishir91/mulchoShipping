import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";

function generateVerificationCode() {
  const length = 6;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let verificationCode = "";
  for (let i = 0; i < length; i++) {
    verificationCode += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return verificationCode;
}

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default class MailController {
  async notifyUserAboutOrders(userEmail, message) {
    console.log(userEmail, message);

    try {
      const mailOptions = {
        from: "mulcho456@gmail.com",
        to: userEmail,
        subject: "Your Order Status",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
              <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
                <h2 style="color: #333333; text-align: center;">Order Status</h2>
                <p style="font-size: 16px; color: #555555;">Dear User,</p>
                <p style="font-size: 16px; color: #555555;">
                  ${message}
                </p>
                <p style="font-size: 16px; color: #555555;">Thank you for being with us.</p>
                <p style="font-size: 16px; color: #555555;">Best regards,</p>
                <p style="font-size: 16px; color: #555555;">The Mulcho Team</p>
              </div>
              <div style="text-align: center; margin-top: 20px;">
                <a href="${process.env.CLIENT_ORIGIN}/orders" style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Go to Dashboard</a>
              </div>
              <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #aaaaaa;">
                <p>&copy; 2024 Mulcho. All rights reserved.</p>
              </div>
            </div>
            `,
      };
      await new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return reject(error);
          } else {
            console.log("Email sent successfully:", info.response);
            resolve(info);
          }
        });
      });

      return true;
    } catch (error) {
      console.log(err);

      return false;
    }
  }

  async notifyUserStatus(userEmail, mailBody) {
    try {
      console.log(userEmail);

      const mailOptions = {
        from: "mulcho456@gmail.com",
        to: userEmail,
        subject: "Your Account Status",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
              <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
                <h2 style="color: #333333; text-align: center;">
                User Account Status
                </h2>
                <p style="font-size: 16px; color: #555555;">Dear User,</p>
                <p style="font-size: 16px; color: #555555;">
                  ${mailBody}
                </p>
                <p style="font-size: 16px; color: #555555;">Thank you for being with us.</p>
                <p style="font-size: 16px; color: #555555;">Best regards,</p>
                <p style="font-size: 16px; color: #555555;">The Mulcho Team</p>
              </div>
              <div style="text-align: center; margin-top: 20px;">
                <a href=${process.env.CLIENT_ORIGIN} style="background-color: #007bff; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Go to Dashboard</a>
              </div>
              <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #aaaaaa;">
                <p>&copy; 2024 Mulcho. All rights reserved.</p>
              </div>
            </div>
            `,
      };

      await new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email:", error);
            return reject(error);
          } else {
            console.log("Email sent successfully:", info.response);
            resolve(info);
          }
        });
      });

      return true;
    } catch (err) {
      console.log(err);

      return false;
    }
  }

  async sendVerificationCode(req, res) {
    try {
      console.log("Finding user by ID:", req.user.id); // Log user ID

      const user = await userModel.findById(req.user.id);
      if (!user) {
        console.log("User not found");
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const generatedCode = generateVerificationCode();
      console.log("Generated Code: ", generatedCode);

      const mailOptions = {
        from: "mulcho456@gmail.com",
        to: user.email,
        subject: "Email Verification",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
            <div style="background-color: #ffffff; padding: 20px; border-radius: 10px;">
              <h2 style="color: #333333; text-align: center;">Verification Code</h2>
              <p style="font-size: 16px; color: #555555;">Dear User,</p>
              <p style="font-size: 16px; color: #555555;">
               Your Verification Code is: 
                <span style="display: inline-block; padding: 10px; background-color: #f0f0f0; color: #333333; font-weight: bold; font-size: 18px; border-radius: 5px; margin-top: 10px;">${generatedCode}</span>
              </p>
              <p style="font-size: 16px; color: #555555;">Please use this code to complete your verification process.</p>
              <p style="font-size: 16px; color: #555555;">Best regards,</p>
              <p style="font-size: 16px; color: #555555;">The Mulcho Team</p>
           </div>
           <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #aaaaaa;">
             <p>&copy; 2024 Mulcho. All rights reserved.</p>
           </div>
         </div>
        `,
      };

      console.log("Sending email...");
      transport.sendMail(mailOptions, async (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res
            .status(500)
            .json({ success: false, message: "Failed to send email" });
        } else {
          // req.session.sentCode = generatedCode; // Save code in session
          const response = await userModel.findByIdAndUpdate(
            req.user.id,
            { otp: generatedCode },
            { new: true }
          );

          if (response) {
            return res.status(200).json({
              success: true,
              message: "Email sent successfully",
              generatedCode: generatedCode,
            });
          }
        }
      });

      console.log("After sendMail call");
    } catch (err) {
      console.error("Error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async verifyCode(req, res) {
    const { code } = req.body;
    const user = await userModel.findById(req.user.id);
    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log(code, user.email, user.otp);

    if (!code) {
      res.json({ success: false, message: "Enter Verification Code" });
    } else if (code === user.otp) {
      await userModel.findByIdAndUpdate(
        req.user.id,
        { isEmailVerified: true },
        { new: true }
      );
      let data = await userModel.findById(req.user.id).select("-password -otp");
      console.log(data);

      if (data) {
        res.json({ success: true, message: "Email Verified", data });
      }
    } else {
      res.json({ success: false, message: "Invalid Verification Code" });
    }
  }
}

import Registration from "../Models/Model.registration.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mail from "../Services/Nodemailer.js";
import maillink from "../Services/NodemailerResetlink.js";
dotenv.config();

//Create Registration
export const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, gmail, password, confirmpassword } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    let newregistration = new Registration({
      firstname,
      lastname,
      gmail,
      password: hashPassword,
      confirmpassword: hashPassword,
    });
    const getdata = await Registration.findOne({
      gmail: gmail,
    });
    if (getdata) {
      res
        .status(201)
        .json({ error: "Register failed.., alredy this mail registered" });
    } else {
      await newregistration.save();
      res.status(200).json({
        message: "user registered succefully",
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Register failed , Registration internal error" });
  }
};

// Login User Check
export const loginUser = async (req, res) => {
  try {
    const { gmail, password } = req.body;
    const getdata = await Registration.findOne({
      gmail: gmail,
    });
    if (!getdata) {
      return res.status(201).json({ message: "user mail not found" });
    }
    const passwordMatch = await bcrypt.compare(password, getdata.password);
    if (!passwordMatch) {
      return res.status(201).json({ message: "Invalid user password" });
    }
    const token = jwt.sign({ _id: getdata._id }, process.env.JWT_SECERT);
    mail(getdata._id);
    res.status(200).json({ message: "Login successfully", token: token });
  } catch (error) {
    res.status(500).json({ error: "Register failed , login internal error" });
  }
};

// get Forgetpassword Link
export const nodemailerLink = async (req, res) => {
  try {
    const { gmail } = req.body;
    const resetdata = await Registration.findOne({ gmail: gmail });
    if (resetdata) {
      maillink(resetdata);
      res.status(200).json({ message: "Resetlink sent to your email" });
    } else {
      res.status(201).json({ message: "Please Enter registered email" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "nodemailerLink  failed , Resetlink internal error" });
  }
};
// resetpassword
export const resetpassword = async (req, res) => {
  try {
    const data = req.body;
    const update = await Registration.updateOne(
      { email: data.email },
      {
        $set: { password: data.password },
        confirmpassword: data.confirmpassword,
      }
    );
    const get = await Registration.findOne({ gmail: data.gmail });
    const hashPassword = await bcrypt.hash(get.password, 10);
    const updatesHashPassword = await Registration.updateOne(
      { gmail: get.gmail },
      {
        $set: { gmail: get.gmail },
        password: hashPassword,
        confirmpassword: hashPassword,
      }
    );
    if (updatesHashPassword.modifiedCount == 1) {
      res.status(200).json({ message: "password  reset successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "password  reset failed , internal error" });
  }
};

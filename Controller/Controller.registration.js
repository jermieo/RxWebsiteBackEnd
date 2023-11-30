import Registration from "../Models/Model.registration.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mail from "../Services/Nodemailer.js";
import maillink from "../Services/NodemailerResetlink.js";
dotenv.config();

// Get data Profile Details
export const getdata = async (req, res) => {
  try {
    const headtocken = req.user;
    const user = await Registration.findById(headtocken);
    if (!user) {
      res.status(201).json({ message: "user details not Found" });
    }
    const userdetails = {
      firstname: user.firstname,
      lastname: user.lastname,
      gmail: user.gmail,
      address1: user.address1,
      address2: user.address2,
      country: user.country,
      state: user.state,
      city: user.city,
      mobileNumber: user.mobileNumber,
      language: user.language,
    };
    res
      .status(200)
      .json({ message: "user details get Successfully", userdetails });
  } catch (error) {
    res.status(500).json({ error: "get by id  failed , internal error" });
  }
};
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
        .json({ message: "Register failed.., alredy this mail registered" });
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
      { gmail: data.gmail },
      {
        $set: { password: data.password },
        confirmpassword: data.confirmpassword,
      }
    );
    const get = await Registration.findOne({ gmail: data.gmail });
    if (get) {
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
    } else {
      res.status(201).json({ message: "Please Enter registered email" });
    }
  } catch (error) {
    res.status(500).json({ error: "password  reset failed , internal error" });
  }
};
// Profile  Update
export const profileUpdate = async (req, res) => {
  try {
    const previousId = req.user;
    const data = req.body.forms;
    const user = await Registration.findById(previousId);
    if (!user) {
      res.status(201).json({ message: "user details not Found" });
    }
    const update = await Registration.updateOne(
      { gmail: user.gmail },
      {
        $set: { address1: data.address1 },
        address2: data.address2,
        country: data.country,
        state: data.state,
        city: data.city,
        language: data.language,
        mobileNumber: data.mobileNumber,
      }
    );
    if (update.modifiedCount === 1) {
      const userdata = await Registration.findById(previousId);
      const data = {
        firstname: userdata.firstname,
        lastname: userdata.lastname,
        gmail: userdata.gmail,
        address1: userdata.address1,
        address2: userdata.address2,
        country: userdata.country,
        state: userdata.state,
        city: userdata.city,
        mobileNumber: userdata.mobileNumber,
        language: userdata.language,
      };
      res.status(200).json({ message: "Profile Update successfully", data });
    }
  } catch (error) {
    res.status(500).json({ error: "Profile , internal error" });
  }
};

import express from "express";
import {
  registerUser,
  loginUser,
  nodemailerLink,
  resetpassword,
  getdata,
  profileUpdate,
} from "../Controller/Controller.registration.js";
import authMiddlewareGetdata from "../Middleware/auth.Middleware.js";
import authMiddlewareUpdatedata from "../Middleware/auth.Profile.js";

const router = express.Router();
// Create Registration
router.post("/create", registerUser);
// loginUser Check
router.post("/login", loginUser);
// Resetlink mail
router.post("/reset/password", nodemailerLink);
// ResetPassword
router.put("/update", resetpassword);
// get UserData
router.post("/get/Profiledata", authMiddlewareGetdata, getdata);
// update Profile
router.put("/update/profile", authMiddlewareUpdatedata, profileUpdate);

export default router;

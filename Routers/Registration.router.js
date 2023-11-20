import express from "express";
import {
  registerUser,
  loginUser,
  nodemailerLink,
  resetpassword,
  getdata,
} from "../Controller/Controller.registration.js";
import authMiddleware from "../Middleware/auth.Middleware.js";

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
router.post("/get/Profiledata", authMiddleware, getdata);

export default router;

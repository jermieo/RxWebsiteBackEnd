import express from "express";
import {
  registerUser,
  loginUser,
  nodemailerLink,
  resetpassword,
} from "../Controller/Controller.registration.js";

const router = express.Router();
// Create Registration
router.post("/create", registerUser);
// loginUser Check
router.post("/login", loginUser);
// Resetlink mail
router.post("/reset/password", nodemailerLink);
// ResetPassword
router.put("/update", resetpassword);

export default router;

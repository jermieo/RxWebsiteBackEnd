import express from "express";
import {
  registerUser,
  loginUser,
  nodemailerLink,
  resetpassword,
  getdata,
  profileUpdate,
  PettyCashCreate,
  PettyCashGet,
  PettyCashDelete,
  PettyCashUpdateCall,
  expenseCreat,
  getExpenseAlldata,
  getdatedata,
  expensedelete,
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
// PettyCash -> post call
router.post("/create/pettycash", PettyCashCreate);
// PettyCash -> Get call
router.get("/get/pettycash", PettyCashGet);
// PettyCash -> Delete call
router.delete("/pettycash/delete/:id", PettyCashDelete);
//  PettyCash -> Update Call
router.put("/pettycash/update", PettyCashUpdateCall);

// Expense Create
router.post("/create/expense", expenseCreat);
// GET Expense
router.get("/get/expense", getExpenseAlldata);
// Get Date Date
router.get("/get/expensedate/:date", getdatedata);
// Delete Expense
router.delete("/expense/delete/:id", expensedelete);
export default router;

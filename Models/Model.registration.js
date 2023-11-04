import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  gmail: String,
  password: String,
  confirmpassword: String,
});

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;

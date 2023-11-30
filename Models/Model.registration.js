import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  gmail: String,
  password: String,
  confirmpassword: String,
  address1: String,
  address2: String,
  country: String,
  state: String,
  city: String,
  language: String,
  mobileNumber: Number,
});

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;

import mongoose from "mongoose";

const pettyCashSchema = new mongoose.Schema({
  date: Date,
  amount: Number,
  totalamt: Number,
  expense: Number,
});

const PettyCash = mongoose.model("PettyCash", pettyCashSchema);

export default PettyCash;

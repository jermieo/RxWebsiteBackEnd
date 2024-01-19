import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  date: Date,
  amount: Number,
  expense: String,
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;

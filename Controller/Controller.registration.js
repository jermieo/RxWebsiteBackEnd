import Registration from "../Models/Model.registration.js";
import PettyCash from "../Models/Model.pettyCashTable.js";
import Expense from "../Models/Model.expense.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mail from "../Services/Nodemailer.js";
import maillink from "../Services/NodemailerResetlink.js";
import moment from "moment-timezone";

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

// PettyCash Create
export const PettyCashCreate = async (req, res) => {
  try {
    const { amount, date, totalamt } = req.body;
    const expense = 0;

    let newregistration = new PettyCash({
      amount,
      date,
      totalamt,
      expense,
    });
    console.log(newregistration, "newregistration");

    const currentDate = moment().tz("Asia/Kolkata");

    if (newregistration && newregistration.date) {
      const newregistrationDate = moment(newregistration.date).tz(
        "Asia/Kolkata"
      );

      if (newregistrationDate.isSame(currentDate, "day")) {
        const existingRecord = await PettyCash.findOne({
          date: {
            $gte: currentDate.startOf("day").toDate(),
            $lt: currentDate.endOf("day").toDate(),
          },
        });

        if (!existingRecord) {
          const userdata = await PettyCash.find();
          let index = userdata.length - 1;

          if (userdata[index]) {
            const GetallData = await Expense.find({
              date: {
                $gte: currentDate.startOf("day").toDate(),
                $lt: currentDate.endOf("day").toDate(),
              },
            });

            const aggregationPipeline = [
              {
                $match: {
                  date: {
                    $gte: currentDate.startOf("day").toDate(),
                    $lt: currentDate.endOf("day").toDate(),
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  totalAmount: { $sum: "$amount" },
                },
              },
            ];

            const result = await Expense.aggregate(aggregationPipeline);

            console.log(GetallData, "GetallData");
            console.log(result, "result");
            console.log(result[0].totalAmount, "result.totalAmount");

            let lastIndexAmt =
              userdata[index].totalamt - parseInt(result[0].totalAmount, 10);
            userdata[index].expense = parseInt(result[0].totalAmount, 10);
            userdata[index].save();
            console.log(userdata[index], "userdata[index]");
            let currentAmt = newregistration.totalamt;
            let finalAmount = lastIndexAmt + currentAmt;
            newregistration.totalamt = finalAmount;
            newregistration.expense = 0;
          }

          await newregistration.save();
          res.status(200).json({
            message: "PettyCase successfully Created",
          });
        } else {
          res.status(201).json({
            message: "A record already exists for the specified date",
          });
        }
      } else {
        res.status(201).json({
          message: "Please select the current date only",
        });
      }
    } else {
      res.status(201).json({
        message: "Invalid date provided",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "PettyCase failed, internal server error" });
  }
};

//  PettyCash Get Data
export const PettyCashGet = async (req, res) => {
  try {
    const GetallData = await PettyCash.find();
    if (GetallData) {
      res.status(200).json({
        message: "PettyCase get all data successfully ",
        GetallData,
      });
    } else {
      res.status(201).json({
        message: "PettyCase  data is Empty ",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "PettyCase failed, internal server error" });
  }
};

//  PettyCash Delete
export const PettyCashDelete = async (req, res) => {
  try {
    const empId = req.params.id;
    const result = await PettyCash.deleteOne({ _id: empId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "PettyCash id not Found" });
    }
    res.status(200).json({ message: "PettyCash Delete successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "PettyCase Delete failed, internal server error" });
  }
};
//  PettyCash Update Call
export const PettyCashUpdateCall = async (req, res) => {
  try {
    const updatedata = req.body;
    const GetallData = await PettyCash.find();
    let index = GetallData.length - 2;
    if (GetallData[index - 2]) {
      let lastIndexAmt = GetallData[index].totalamt;
      let expense = GetallData[index].expense;
      let toteldata = lastIndexAmt - expense;
      let currentAmt = updatedata.totalamt;
      let finalAmount = toteldata + currentAmt;
      const updateOne = await PettyCash.updateOne(
        { _id: updatedata._id },
        {
          $set: { date: updatedata.date },
          amount: updatedata.amount,
          totalamt: finalAmount,
        }
      );
      if (updateOne.modifiedCount === 1) {
        res.status(200).json({
          message: "PettyCase Edit successfully",
        });
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "PettyCase Edit failed, internal server error" });
  }
};

// Expense Create
export const expenseCreat = async (req, res) => {
  try {
    const { date, amount, expense } = req.body;
    const currentDate = moment().tz("Asia/Kolkata");

    if (!date || !amount || !expense) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    const newExpenseDate = moment(date).tz("Asia/Kolkata");

    if (!newExpenseDate.isSame(currentDate, "day")) {
      return res
        .status(201)
        .json({ message: "Please select the current date only" });
    }

    const existingPettyCash = await PettyCash.findOne({
      date: {
        $gte: currentDate.startOf("day").toDate(),
        $lt: currentDate.endOf("day").toDate(),
      },
    });

    if (existingPettyCash) {
      return res.status(201).json({
        message: "Today PettyCash A/C Closed. Don't create an expense.",
      });
    }

    const userdata = await PettyCash.find();
    const lastIndex = userdata.length - 1;

    if (userdata[lastIndex]) {
      const GetallData = await Expense.find({
        date: {
          $gte: currentDate.startOf("day").toDate(),
          $lt: currentDate.endOf("day").toDate(),
        },
      });

      const aggregationPipeline = [
        {
          $match: {
            date: {
              $gte: currentDate.startOf("day").toDate(),
              $lt: currentDate.endOf("day").toDate(),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ];

      const result = await Expense.aggregate(aggregationPipeline);

      console.log(GetallData, "GetallData");
      console.log(result, "result");

      const totalex =
        userdata[lastIndex].totalamt - parseInt(result[0].totalAmount, 10);

      if (amount <= totalex) {
        const newExpense = new Expense({
          date,
          amount,
          expense,
        });

        await newExpense.save();

        res.status(200).json({
          message: "Expense successfully created",
        });
      } else {
        return res.status(201).json({
          message: "Your balance Amount is " + totalex,
        });
      }
    } else {
      return res.status(500).json({
        message: "Unable to retrieve PettyCash data",
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Expense creation failed, internal server error" });
  }
};

// getExpenseAlldata;
export const getExpenseAlldata = async (req, res) => {
  try {
    const GetallData = await Expense.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },

          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }, // Count of records
        },
      },
      {
        $sort: {
          "_id.date": 1, // Sort by date in ascending order
        },
      },
    ]);

    console.log(GetallData);

    if (GetallData) {
      res.status(200).json({
        message: "Expense get all data successfully ",
        GetallData,
      });
    } else {
      res.status(201).json({
        message: "Expense  data is Empty ",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Expense failed, internal server error" });
  }
};

// Get date  data
export const getdatedata = async (req, res) => {
  try {
    const date = req.params.date;

    // Assuming 'date' is a string in the format "YYYY-MM-DD"
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1); // Next day

    const records = await Expense.find({
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.status(200).json({ records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Date query failed, internal server error" });
  }
};

// Expense Delete
export const expensedelete = async (req, res) => {
  try {
    const Exid = req.params.id;
    console.log(Exid, "Exid");

    const currentDate = moment().tz("Asia/Kolkata");

    const existingPettyCash = await PettyCash.findOne({
      date: {
        $gte: currentDate.startOf("day").toDate(),
        $lt: currentDate.endOf("day").toDate(),
      },
    });

    if (existingPettyCash) {
      return res.status(201).json({
        message: "Today PettyCash A/C Closed. Don't Delete expense.",
      });
    } else {
      const result = await Expense.deleteOne({ _id: Exid });
      console.log(result, "result");
      return res.status(200).json({ message: "Expense Delete successfully" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "PettyCase Delete failed, internal server error" });
  }
};

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./Database/Database.js";
import routerRegistration from "./Routers/Registration.router.js";

const app = express();

dotenv.config();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api/registration", routerRegistration);

connectDB();

app.listen(port, () => {
  console.log("App is listening", port);
});

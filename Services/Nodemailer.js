import nodemailer from "nodemailer";
import Registration from "../Models/Model.registration.js";

const mail = async (data) => {
  const logindata = await Registration.findOne({ _id: data });
  const { gmail } = logindata;
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jermieorex1798@gmail.com",
      pass: "yasl lfym hmcg gscj",
    },
  });

  let details = {
    from: "jermieorex1798@gmail.com",
    to: gmail,
    subject: "Login msg",
    text: "login successfully",
  };

  mailTransporter.sendMail(details, (err) => {
    if (err) {
      console.log("mail not send");
      //   res.status(201).json({
      //     message: "mail not send",
      //   });
    } else {
      console.log("mail sent successfully");
      //   res.status(201).json({
      //     message: "mail sent successfully",
      //   });
    }
  });
};
export default mail;

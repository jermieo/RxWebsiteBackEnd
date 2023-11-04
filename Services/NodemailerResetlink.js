import nodemailer from "nodemailer";

const maillink = async (resetdata) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jermieorex1798@gmail.com",
      pass: "yasl lfym hmcg gscj",
    },
  });
  const emailHtml = "https://rx-website-front.netlify.app/resetpwpage";

  let details = {
    from: "jermieorex1798@gmail.com",
    to: resetdata.gmail,
    subject: "Go to Reset page",
    text: emailHtml,
  };

  mailTransporter.sendMail(details, (err) => {
    if (err) {
      console.log("mail not send");
    } else {
      console.log("mail sent successfully");
      res.status(200).json({ message: "mail sent successfully" });
    }
  });
};

export default maillink;

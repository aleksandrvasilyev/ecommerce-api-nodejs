import nodemailer from "nodemailer";

const sendEmail = (sendEmailTo, subject, template) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_SERVICE_EMAIL,
      pass: process.env.GMAIL_SERVICE_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_SERVICE_EMAIL,
    to: sendEmailTo,
    subject: subject,
    // text: "This email sent from localhost!",
    html: template,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new Error(error);
    }
    console.log("Email sent: " + info.response);
    return true;
  });
};

export default sendEmail;

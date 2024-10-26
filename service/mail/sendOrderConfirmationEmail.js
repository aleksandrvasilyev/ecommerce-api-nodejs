import sendEmail from "./sendEmail.js";
import fs from "fs";

const sendOrderConfirmationEmail = (sendEmailTo, order) => {
  const subject = "Order Confirmation";

  let htmlTemplate = fs.readFileSync(
    `${import.meta.dirname}/template/orderConfirmation.html`,
    "utf-8"
  );

  //   htmlTemplate = htmlTemplate.replace(
  //     "https://example.com/confirm?token=YOUR_TOKEN_HERE",
  //     `${process.env.DOMAIN_NAME}/confirm?token=${token}`
  //   );

  sendEmail(sendEmailTo, subject, htmlTemplate);
};

export default sendOrderConfirmationEmail;

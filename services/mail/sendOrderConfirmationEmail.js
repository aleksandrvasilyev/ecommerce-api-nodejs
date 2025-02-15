import sendEmail from "./sendEmail.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendOrderConfirmationEmail = (sendEmailTo, order) => {
  const subject = "Order Confirmation";

  let htmlTemplate = fs.readFileSync(
    // `${path.join(__dirname, "/template/orderConfirmation.html")}`,
    `${__dirname}/template/orderConfirmation.html`,
    "utf-8"
  );

  //   htmlTemplate = htmlTemplate.replace(
  //     "https://example.com/confirm?token=YOUR_TOKEN_HERE",
  //     `${process.env.DOMAIN_NAME}/confirm?token=${token}`
  //   );

  sendEmail(sendEmailTo, subject, htmlTemplate);
};

export default sendOrderConfirmationEmail;

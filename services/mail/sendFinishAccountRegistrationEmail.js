import sendEmail from "./sendEmail.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendFinishAccountRegistrationEmail = (sendEmailTo, token) => {
  const subject = "Complete account registration";

  let htmlTemplate = fs.readFileSync(
    // `${path.join(__dirname, "/template/finishAccountRegistration.html")}`,
    `${__dirname}/template/finishAccountRegistration.html`,
    "utf-8"
  );

  htmlTemplate = htmlTemplate.replace(
    "https://example.com/confirm?token=YOUR_TOKEN_HERE",
    `${process.env.DOMAIN_NAME}/confirm?token=${token}`
  );

  sendEmail(sendEmailTo, subject, htmlTemplate);
};

export default sendFinishAccountRegistrationEmail;

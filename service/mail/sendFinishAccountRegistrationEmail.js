import sendEmail from "./sendEmail.js";
import fs from "fs";

const sendFinishAccountRegistrationEmail = (sendEmailTo, token) => {
  const subject = "Complete account registration";

  let htmlTemplate = fs.readFileSync(
    `${import.meta.dirname}/template/finishAccountRegistration.html`,
    "utf-8"
  );

  htmlTemplate = htmlTemplate.replace(
    "https://example.com/confirm?token=YOUR_TOKEN_HERE",
    `${process.env.DOMAIN_NAME}/confirm?token=${token}`
  );

  sendEmail(sendEmailTo, subject, htmlTemplate);
};

export default sendFinishAccountRegistrationEmail;

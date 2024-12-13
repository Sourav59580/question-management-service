import nodemailer from "nodemailer";

export const sendMail  = async (email, password) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_AUTH_USER,
    to: email,
    subject: "Question Management Login Credentials",
    text:
      "Your Question Managment account has been created successfully. Please use the following credentials to login: \n\nUsername: " +
      email +
      "\nPassword: " +
      password,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log(error);
  }
};

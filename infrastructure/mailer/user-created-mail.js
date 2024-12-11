import nodemailer from "nodemailer";

export const sendMail  = async (email, password) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: 465,
    service: "gmail",
    auth: {
      user: "monikadhiman2205@gmail.com",
      pass: "soya njuz gdfl gjpj",
    },
  });
  const mailOptions = {
    from: "monikadhiman2205@gmail.com",
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

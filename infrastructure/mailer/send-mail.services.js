const nodemailer = require("nodemailer");

class SendMailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
      },
    });
  }

  async sendMail(email, content) {
    const mailOptions = {
      from: process.env.MAIL_AUTH_USER,
      to: email,
      subject: content.subject,
      text: content.text,
    };

    return this.transporter.sendMail(mailOptions);
  }

  generateFourDigitPassword() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async sendAccountCreationEmail(email, password) {
    const content = {
      subject: "Question Management Account Created",
      text:
        "Your Question Management account has been created successfully. Please use the following credentials to login: \n\nUsername: " +
        email +
        "\nPassword: " +
        password,
    };
    return this.sendMail(email, content);
  }

  async sendForgotPasswordOTP(email, token) {
    const content = {
      subject: "Question Management Set New Password OTP",
      text:
        "You have requested to reset your password. Please use the following OTP to set a new password: \n\nOTP: " +
        token,
    };
    return this.sendMail(email, content);
  }
}

module.exports = new SendMailService();

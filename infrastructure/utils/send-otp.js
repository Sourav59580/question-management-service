// const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const from = "Vonage APIs";
const to = "918950523578";

exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};
exports.sendOTP = async ({ to, from, otp }) => {
  const text = `Your OTP is ${otp}`;
  return vonage.sms.send({ to, from, text });
};

// exports.sendOTP = async (phone) => {
//   try {
//     await twilio.messages.create({
//       body: `Your OTP is ${otp}`,
//       to: `+91${phone}`, // Replace with your country code and phone number
//       from: process.env.TWILIO_PHONE_NUMBER,
//     });
//   } catch (err) {
//     console.error(err);
//     throw new Error('Error in sending OTP');
//   }
// };

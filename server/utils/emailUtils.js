import nodemailer from 'nodemailer';

const buildTransport = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

export const sendOtpEmail = async (to, otp) => {
  const transporter = buildTransport();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Samagama password reset code',
    text: `Your password reset OTP is ${otp}. It expires in 10 minutes.`
  });
};
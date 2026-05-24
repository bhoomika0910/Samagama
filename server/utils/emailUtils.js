import nodemailer from 'nodemailer';

const buildTransport = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = buildTransport();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
};

export const sendWelcomeEmail = async ({ to, name, tempPassword }) => {
  await sendEmail({
    to,
    subject: 'Welcome to Samagama',
    text: `Hi ${name},\n\nYour temporary password is: ${tempPassword}\n\nPlease sign in and change it right away.`,
    html: `<p>Hi ${name},</p><p>Your temporary password is <strong>${tempPassword}</strong>.</p><p>Please sign in and change it right away.</p>`
  });
};

export const sendResetLinkEmail = async ({ to, name, link }) => {
  await sendEmail({
    to,
    subject: 'Reset your Samagama password',
    text: `Hi ${name},\n\nReset your password using this link:\n${link}\n\nIf you did not request this, ignore this email.`,
    html: `<p>Hi ${name},</p><p>Reset your password using this link:</p><p><a href="${link}">${link}</a></p><p>If you did not request this, ignore this email.</p>`
  });
};
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
    subject: 'Your login credentials - Samagama',
    text: `Hi ${name},\n\nYour account is ready.\nEmail: ${to}\nTemporary password: ${tempPassword}\nLog in at: ${process.env.CLIENT_URL}\nYou will be asked to set a new password on first login.\n\nThis is an automated message.`,
    html: `<p>Hi ${name},</p><p>Your account is ready.</p><p><strong>Email:</strong> ${to}<br/><strong>Temporary password:</strong> ${tempPassword}<br/><strong>Log in at:</strong> <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a></p><p>You will be asked to set a new password on first login.</p><p>This is an automated message.</p>`
  });
};

export const sendResetLinkEmail = async ({ to, name, link }) => {
  await sendEmail({
    to,
    subject: 'Reset your Samagama password',
    text: `Hi ${name},\n\nReset your password using this link:\n${link}\n\nThis link expires in 1 hour.\nIf you did not request this, ignore this email.`,
    html: `<p>Hi ${name},</p><p>Reset your password using this link:</p><p><a href="${link}">${link}</a></p><p>This link expires in 1 hour.</p><p>If you did not request this, ignore this email.</p>`
  });
};
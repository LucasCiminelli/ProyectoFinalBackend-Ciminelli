import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'emilia66@ethereal.email',
      pass: 'hapM9n5fdZ9dmNCmZB'
  }
});

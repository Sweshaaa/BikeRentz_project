import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: MailOptions): Promise<void> {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || "BikeRentz <no-reply@bikerentz.com>",
    to,
    subject,
    html,
  });
}

export function passwordResetTemplate(resetUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#FF6A00;">BikeRentz Password Reset</h2>
      <p>You requested a password reset. Click the button below to set a new password. This link expires in 30 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block;background:#1C1C1C;color:#FF6A00;padding:12px 24px;border-radius:8px;text-decoration:none;">Reset Password</a>
      <p style="color:#888;font-size:12px;">If you did not request this, you can safely ignore this email.</p>
    </div>
  `;
}

export function bookingConfirmationTemplate(bikeName: string, startDate: string, endDate: string, total: number): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#FF6A00;">Booking Confirmed 🏍️</h2>
      <p>Your rental for <strong>${bikeName}</strong> is confirmed.</p>
      <p><strong>From:</strong> ${startDate}<br/><strong>To:</strong> ${endDate}<br/><strong>Total:</strong> Rs. ${total}</p>
      <p>Ride safe!</p>
    </div>
  `;
}

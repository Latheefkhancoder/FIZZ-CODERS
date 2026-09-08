const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

/**
 * Get or initialize nodemailer transporter if configured
 */
const getTransporter = () => {
  if (!transporter && env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER
        ? {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          }
        : undefined,
    });
  }
  return transporter;
};

/**
 * Send password reset email to a user
 * @param {string} toEmail - Recipient email
 * @param {string} resetToken - Raw password reset token
 * @returns {Promise<{ delivered: boolean, link: string }>}
 */
const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const baseUrl = env.RESET_PASSWORD_URL || `${env.FRONTEND_URL}/reset-password`;
  const resetLink = `${baseUrl}?token=${encodeURIComponent(resetToken)}`;

  const emailSubject = "FIZZ-CONNECT - Password Reset Request";
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">FIZZ-CONNECT</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account.</p>
      <p style="margin: 24px 0;">
        <a href="${resetLink}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset Your Password
        </a>
      </p>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #64748b; font-size: 14px;">${resetLink}</p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
        This reset link will expire in 1 hour. If you did not request a password reset, please ignore this email.
      </p>
    </div>
  `;

  const activeTransporter = getTransporter();

  if (activeTransporter) {
    try {
      await activeTransporter.sendMail({
        from: env.EMAIL_FROM,
        to: toEmail,
        subject: emailSubject,
        html: emailHtml,
      });
      return { delivered: true, link: resetLink };
    } catch (err) {
      console.error("[FIZZ-CONNECT Email] Failed to send email via SMTP:", err.message);
      // In dev/test, fallback to logging
      return { delivered: false, link: resetLink, error: err.message };
    }
  } else {
    // Development / mock fallback logger
    console.log(`[FIZZ-CONNECT Email (Dev Mock)] Reset email simulated for: ${toEmail}`);
    console.log(`[FIZZ-CONNECT Email (Dev Mock)] Reset Link: ${resetLink}`);
    return { delivered: true, link: resetLink, simulated: true };
  }
};

module.exports = {
  sendPasswordResetEmail,
};

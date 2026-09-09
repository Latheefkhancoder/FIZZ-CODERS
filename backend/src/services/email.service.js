const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

/**
 * Get or initialize nodemailer transporter if configured
 */
const getTransporter = () => {
  if (!transporter && env.SMTP_HOST && env.SMTP_HOST.trim()) {
    const isSecure = env.SMTP_PORT === 465;
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST.trim(),
      port: env.SMTP_PORT,
      secure: isSecure,
      auth: env.SMTP_USER
        ? {
            user: env.SMTP_USER.trim(),
            pass: env.SMTP_PASSWORD,
          }
        : undefined,
    });
  }
  return transporter;
};

/**
 * Check and verify SMTP connection health (safe, no secrets logged)
 * @returns {Promise<{ configured: boolean, verified: boolean, message: string, error?: string }>}
 */
const verifyEmailTransport = async () => {
  if (!env.SMTP_HOST || !env.SMTP_HOST.trim()) {
    return {
      configured: false,
      verified: false,
      message: "SMTP is not configured (SMTP_HOST is empty). Running in local development simulation mode.",
    };
  }

  const activeTransporter = getTransporter();
  if (!activeTransporter) {
    return {
      configured: false,
      verified: false,
      message: "Failed to initialize nodemailer transporter.",
    };
  }

  try {
    await activeTransporter.verify();
    return {
      configured: true,
      verified: true,
      message: "SMTP connection successfully established and verified with mail server.",
    };
  } catch (err) {
    return {
      configured: true,
      verified: false,
      message: "SMTP connection failed.",
      error: err.message,
    };
  }
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
        from: env.EMAIL_FROM || env.SMTP_USER || "no-reply@fizzconnect.com",
        to: toEmail,
        subject: emailSubject,
        html: emailHtml,
      });
      console.log(`[FIZZ-CONNECT Email] Password reset email successfully delivered via SMTP to: ${toEmail}`);
      return { delivered: true, link: resetLink };
    } catch (err) {
      console.error(`[FIZZ-CONNECT Email] Failed to send password reset email via SMTP to ${toEmail}:`, err.message);
      return { delivered: false, link: resetLink, error: err.message };
    }
  } else {
    // Development / mock fallback logger (safe, no raw secret credentials logged)
    console.log(`[FIZZ-CONNECT Email (Dev Mock)] Password reset email simulated for recipient: ${toEmail} (SMTP not configured in backend/.env)`);
    return { delivered: true, link: resetLink, simulated: true };
  }
};

/**
 * Send email verification OTP code
 * @param {string} toEmail - Recipient email
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<{ delivered: boolean, simulated?: boolean, error?: string }>}
 */
const sendEmailVerificationOtp = async (toEmail, otp) => {
  const emailSubject = "FIZZ-CONNECT - Verify Your Email Address";
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #0f172a; color: #f8fafc;">
      <h2 style="color: #6366f1; margin: 0 0 16px 0; font-size: 24px;">FIZZ-CONNECT</h2>
      <p style="font-size: 16px; margin-bottom: 12px;">Hello,</p>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.5;">
        Thank you for joining FIZZ-CONNECT! Please use the following 6-digit verification code to complete your email verification:
      </p>
      <div style="margin: 28px 0; text-align: center;">
        <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #a5b4fc; background: #1e293b; padding: 12px 28px; border-radius: 8px; border: 1px solid #334155; display: inline-block;">
          ${otp}
        </span>
      </div>
      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
        This code is valid for <strong>10 minutes</strong>. For your security, never share this code with anyone.
      </p>
      <p style="color: #64748b; font-size: 12px; margin-top: 28px; border-top: 1px solid #334155; padding-top: 16px;">
        If you did not request this code, you can safely disregard this email.
      </p>
    </div>
  `;

  const activeTransporter = getTransporter();

  if (activeTransporter) {
    try {
      await activeTransporter.sendMail({
        from: env.EMAIL_FROM || env.SMTP_USER || "no-reply@fizzconnect.com",
        to: toEmail,
        subject: emailSubject,
        html: emailHtml,
      });
      console.log(`[FIZZ-CONNECT Email] Verification OTP email successfully delivered via SMTP to: ${toEmail}`);
      return { delivered: true };
    } catch (err) {
      console.error(`[FIZZ-CONNECT Email] Failed to send verification OTP email via SMTP to ${toEmail}:`, err.message);
      return { delivered: false, error: err.message };
    }
  } else {
    // Development / mock fallback logger (safe, no secret credentials logged)
    console.log(`[FIZZ-CONNECT Email (Dev Mock)] Verification email simulated for recipient: ${toEmail} (SMTP not configured in backend/.env)`);
    return { delivered: true, simulated: true };
  }
};

module.exports = {
  getTransporter,
  verifyEmailTransport,
  sendPasswordResetEmail,
  sendEmailVerificationOtp,
};



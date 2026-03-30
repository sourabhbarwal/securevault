const nodemailer = require('nodemailer');

const createTransporter = () =>
  nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });

const template = (content) => `
<!DOCTYPE html><html><head><meta charset="utf-8"/>
<style>
  body{font-family:'Segoe UI',sans-serif;background:#04060F;color:#E8EDF8;margin:0;padding:40px 20px}
  .card{max-width:520px;margin:0 auto;background:#0C1428;border:1px solid rgba(126,255,245,0.1);border-radius:16px;padding:40px}
  .logo{font-size:20px;font-weight:800;color:#7EFFF5;margin-bottom:24px}
  .btn{display:inline-block;padding:13px 28px;background:linear-gradient(135deg,#7EFFF5,#4DD9CC);color:#04060F;font-weight:700;border-radius:10px;text-decoration:none;margin-top:20px}
  .footer{margin-top:28px;font-size:12px;color:#3D4F70}
  code{background:#080D1E;padding:3px 8px;border-radius:4px;font-family:monospace;color:#7EFFF5;font-size:13px}
</style>
</head><body><div class="card">
  <div class="logo">🔐 SecureVault</div>
  ${content}
  <div class="footer">If you didn't request this, you can safely ignore it.</div>
</div></body></html>`;

const sendVerificationEmail = async (user, token) => {
  const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  await createTransporter().sendMail({
    from: `"SecureVault" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Verify your SecureVault email',
    html: template(`
      <h2 style="margin:0 0 10px">Verify your email</h2>
      <p style="color:#7A8AAD;line-height:1.6">Click below to activate your account.</p>
      <a href="${url}" class="btn">Verify Email</a>
      <p style="margin-top:16px;font-size:12px;color:#3D4F70">Or copy: <code>${url}</code></p>
      <p style="font-size:12px;color:#3D4F70">Expires in 24 hours.</p>
    `),
  });
};

const sendPasswordResetEmail = async (user, token) => {
  const url = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await createTransporter().sendMail({
    from: `"SecureVault" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Reset your SecureVault password',
    html: template(`
      <h2 style="margin:0 0 10px">Reset your password</h2>
      <p style="color:#7A8AAD;line-height:1.6">Click below to set a new master password.</p>
      <a href="${url}" class="btn">Reset Password</a>
      <p style="font-size:12px;color:#3D4F70;margin-top:16px">Expires in 1 hour.</p>
    `),
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
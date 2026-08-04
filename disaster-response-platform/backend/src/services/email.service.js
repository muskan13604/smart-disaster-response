const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER || 'ethereal_user',
                pass: process.env.SMTP_PASS || 'ethereal_pass'
            }
        });
    }

    async sendPasswordResetEmail(to, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: '"Disaster Response Team" <noreply@disasterresponse.local>',
            to: to,
            subject: 'Password Reset Request',
            html: `
                <h1>You requested a password reset</h1>
                <p>Please click on the following link to reset your password:</p>
                <a href="${resetUrl}" target="_blank">Reset Password</a>
            `
        };

        const info = await this.transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        // If ethereal, we would see the preview URL here
        if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    }
}
module.exports = new EmailService();

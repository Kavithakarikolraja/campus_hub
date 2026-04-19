const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can change this to match your preferred service
            auth: {
                user: process.env.EMAIL_USER || 'placeholder@gmail.com',
                pass: process.env.EMAIL_PASS || 'placeholder_pass'
            }
        });

        const mailOptions = {
            from: 'CampusHub Updates <noreply@campushub.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log(`[Email System] Email physically sent to ${options.email}`);
        } else {
            console.log(`[Email Simulation/Dev Mode] To: ${options.email} | Subject: ${options.subject} | Message: ${options.message}`);
        }
    } catch (err) {
        console.error("[Email Error] Failed to send email:", err.message);
    }
};

module.exports = sendEmail;

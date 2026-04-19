require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

async function test() {
    console.log("Testing email...");
    await sendEmail({
        email: "test@example.com",
        subject: "Test Subject",
        message: "Test Message"
    });
    console.log("Test finished.");
    process.exit(0);
}

test();

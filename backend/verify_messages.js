const mongoose = require('mongoose');
const Message = require('./models/Message');
const connectDB = require('./config/db');
require('dotenv').config();
const fs = require('fs');

async function test() {
    await connectDB();
    const messages = await Message.find({});
    fs.writeFileSync('messages_utf8.json', JSON.stringify(messages, null, 2), 'utf8');
    process.exit(0);
}
test();

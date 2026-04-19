require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Message = require('./models/Message');
const connectDB = require('./config/db');

async function seedMassMessages() {
    await connectDB();
    console.log("Seeding direct messages to all testing users...");
    
    // Get Alan Turing or any predefined dummy
    const alan = await User.findOne({ email: "alan@campushub.com" });
    if (!alan) {
        console.log("No Alan Turing found! Exiting.");
        process.exit(1);
    }

    // Find ALL strictly real users (excluding dummy Alan)
    const realUsers = await User.find({ email: { $ne: "alan@campushub.com" } });
    
    if (realUsers.length === 0) {
        console.log("No real users exist to ping.");
        process.exit(0);
    }

    // Ping every single user with a direct text message in their respective room!
    for (let u of realUsers) {
        const room = [String(alan._id), String(u._id)].sort().join('_');
        
        const existingMessage = await Message.findOne({ room: room, text: /Hello/ });
        
        if (!existingMessage) {
            await Message.create({
                room: room,
                authorId: alan._id,
                authorName: "Dr. Alan Turing",
                text: `Hello ${u.name}! I noticed your impressive profile on CampusHub. Would you be open to a project collaboration or skill swap this week?`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
            console.log(`Sent direct message to user: ${u.name}`);
        }
    }
    
    console.log("Messages synced to all live users!");
    process.exit(0);
}

seedMassMessages().catch(err => {
    console.error(err);
    process.exit(1);
});

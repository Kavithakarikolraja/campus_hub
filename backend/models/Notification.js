const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['swap_request', 'swap_accepted', 'system', 'session_scheduled'], default: 'system' }
}, { timestamps: true });

// Post-save hook to automatically dispatch emails for any notification created
notificationSchema.post('save', async function(doc) {
    try {
        const User = mongoose.model('User');
        const userObj = await User.findById(doc.user).select('email name');
        
        if (userObj && userObj.email) {
            await sendEmail({
                email: userObj.email,
                subject: doc.title,
                message: `Hi ${userObj.name},\n\nYou have a new update on CampusHub:\n\n${doc.message}\n\nLog in to your dashboard to view more details.\n\nBest,\nCampusHub Team`
            });
        }
    } catch (err) {
        console.error("Error triggering email from notification:", err.message);
    }
});

module.exports = mongoose.model('Notification', notificationSchema);

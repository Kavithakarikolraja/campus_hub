const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String },
    githubUsername: { type: String },
    linkedinUrl: { type: String },
    points: { type: Number, default: 0 },
    skillsOffered: [{
        name: { type: String, required: true },
        category: { type: String, required: true }
    }],
    skillsWanted: [{
        name: { type: String, required: true },
        category: { type: String, required: true }
    }],
    role: { type: String, default: 'user' }, // 'user' or 'admin'
    isVerifiedMentor: { type: Boolean, default: false },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

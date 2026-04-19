const mongoose = require('mongoose');

const mentorCredentialSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillName: { type: String, required: true },
    experienceLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], required: true },
    yearsOfExperience: { type: Number, required: true },
    portfolioLink: { type: String },
    certificateFile: { type: String, required: true }, // PATH to uploaded file
    status: { type: String, enum: ['Pending Review', 'Approved Mentor', 'Rejected'], default: 'Pending Review' },
    description: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('MentorCredential', mentorCredentialSchema);

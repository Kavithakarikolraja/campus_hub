const MentorCredential = require('../models/MentorCredential');
const User = require('../models/User');

const submitCredential = async (req, res) => {
    try {
        const { skillName, experienceLevel, yearsOfExperience, portfolioLink, description } = req.body;
        const userId = req.user._id;

        // Handle file upload
        const certificateFile = req.file ? `/uploads/${req.file.filename}` : null;
        if (!certificateFile) {
            return res.status(400).json({ message: 'Certificate proof is required' });
        }

        const credential = await MentorCredential.create({
            user: userId,
            skillName,
            experienceLevel,
            yearsOfExperience,
            portfolioLink,
            certificateFile,
            description
        });

        res.status(201).json(credential);
    } catch (error) {
        res.status(500).json({ message: 'Failed to submit credential', error: error.message });
    }
};

const getPendingCredentials = async (req, res) => {
    try {
        const credentials = await MentorCredential.find({ status: 'Pending Review' }).populate('user', 'name email department');
        res.json(credentials);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch credentials' });
    }
};

const updateCredentialStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const credential = await MentorCredential.findById(req.params.id).populate('user');

        if (!credential) {
            return res.status(404).json({ message: 'Credential not found' });
        }

        credential.status = status;
        await credential.save();

        // If approved, verify the user
        if (status === 'Approved Mentor') {
            const user = await User.findById(credential.user._id);
            user.isVerifiedMentor = true;
            await user.save();
        }

        res.json(credential);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update status' });
    }
};

const getMyCredentials = async (req, res) => {
    try {
        const credentials = await MentorCredential.find({ user: req.user._id });
        res.json(credentials);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch credentials' });
    }
};

module.exports = { submitCredential, getPendingCredentials, updateCredentialStatus, getMyCredentials };

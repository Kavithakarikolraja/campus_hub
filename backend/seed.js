require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const mockUsers = [
            {
                name: 'Sarah Chen',
                email: 'sarah.c@college.edu',
                password: hashedPassword,
                department: 'Computer Science',
                skillsOffered: [{ name: 'React.js', category: 'Technical' }, { name: 'UX Design', category: 'Design' }],
                skillsWanted: [{ name: 'Public Speaking', category: 'Communication' }],
                githubUsername: 'sarahcodes',
                linkedinUrl: 'https://linkedin.com/in/sarahchen',
                points: 450
            },
            {
                name: 'Michael Rodriguez',
                email: 'miguel.r@college.edu',
                password: hashedPassword,
                department: 'Mechanical',
                skillsOffered: [{ name: 'AutoCAD', category: 'Technical' }, { name: 'Math Mentoring', category: 'Aptitude' }],
                skillsWanted: [{ name: 'Python', category: 'Technical' }],
                points: 120
            },
            {
                name: 'Aisha Patel',
                email: 'apatel@college.edu',
                password: hashedPassword,
                department: 'Business/Management',
                skillsOffered: [{ name: 'Presentation Skills', category: 'Communication' }, { name: 'Leadership', category: 'Communication' }],
                skillsWanted: [{ name: 'Data Analysis', category: 'Technical' }],
                linkedinUrl: 'https://linkedin.com/in/aishapatel',
                points: 850
            },
            {
                name: 'James Wilson',
                email: 'jwilson@college.edu',
                password: hashedPassword,
                department: 'Electronics',
                skillsOffered: [{ name: 'Circuit Design', category: 'Technical' }],
                skillsWanted: [{ name: 'C++', category: 'Technical' }],
                points: 30
            },
            {
                name: 'Elena Rostova',
                email: 'elena.r@college.edu',
                password: hashedPassword,
                department: 'Arts/Design',
                skillsOffered: [{ name: 'Figma', category: 'Design' }, { name: 'Logo Design', category: 'Design' }],
                skillsWanted: [{ name: 'HTML/CSS', category: 'Technical' }],
                points: 320
            },
            {
                name: 'David Kim',
                email: 'dkim@college.edu',
                password: hashedPassword,
                department: 'Computer Science',
                skillsOffered: [{ name: 'Logical Reasoning', category: 'Aptitude' }, { name: 'Algorithm Prep', category: 'Technical' }],
                skillsWanted: [{ name: 'Interview Prep', category: 'Communication' }],
                points: 210
            }
        ];

        // Clear existing EXCEPT the user's personal account (using simple email filtering if we knew it, or just append)
        // We will just append these reference users to the database.

        for (const u of mockUsers) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`Added test user: ${u.name}`);
            } else {
                console.log(`User already exists: ${u.name}`);
            }
        }

        console.log('Seeding Complete. You can now discover these users in the Hub!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedUsers();

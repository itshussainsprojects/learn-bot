import express from 'express';
import User from '../models/User.js';
import Progress from '../models/Progress.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, level } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            level: level || 'beginner'
        });

        // Create initial progress for the user
        await Progress.create({
            user: user._id,
            learningPath: [
                { stepId: 1, title: 'JavaScript Fundamentals', status: 'current', progress: 0 },
                { stepId: 2, title: 'Functions & Scope', status: 'locked', progress: 0 },
                { stepId: 3, title: 'Arrays & Objects', status: 'locked', progress: 0 },
                { stepId: 4, title: 'Async JavaScript', status: 'locked', progress: 0 },
                { stepId: 5, title: 'DOM Manipulation', status: 'locked', progress: 0 },
                { stepId: 6, title: 'React Basics', status: 'locked', progress: 0 }
            ]
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Update streak
        const now = new Date();
        const lastActive = new Date(user.streak.lastActive);
        const hoursDiff = (now - lastActive) / (1000 * 60 * 60);

        if (hoursDiff > 24 && hoursDiff < 48) {
            // Continue streak
            user.streak.current += 1;
            user.streak.longest = Math.max(user.streak.longest, user.streak.current);
        } else if (hoursDiff >= 48) {
            // Reset streak
            user.streak.current = 1;
        }
        user.streak.lastActive = now;
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            badges: user.badges,
            progress: user.progress,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
    try {
        // This route requires the protect middleware
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            level: user.level,
            xp: user.xp,
            streak: user.streak,
            badges: user.badges,
            progress: user.progress
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(401).json({ message: 'Not authorized' });
    }
});

export default router;

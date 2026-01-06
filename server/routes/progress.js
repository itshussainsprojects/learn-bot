import express from 'express';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/progress
// @desc    Get current user's learning progress
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        let progress = await Progress.findOne({ user: req.user._id });

        // Create default progress if doesn't exist
        if (!progress) {
            progress = await Progress.create({
                user: req.user._id,
                learningPath: [
                    { stepId: 1, title: 'JavaScript Fundamentals', status: 'current', progress: 0 },
                    { stepId: 2, title: 'Functions & Scope', status: 'locked', progress: 0 },
                    { stepId: 3, title: 'Arrays & Objects', status: 'locked', progress: 0 },
                    { stepId: 4, title: 'Async JavaScript', status: 'locked', progress: 0 },
                    { stepId: 5, title: 'DOM Manipulation', status: 'locked', progress: 0 },
                    { stepId: 6, title: 'React Basics', status: 'locked', progress: 0 }
                ]
            });
        }

        res.json(progress);
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ message: 'Error fetching progress' });
    }
});

// @route   PUT /api/progress/step/:stepId
// @desc    Update progress for a learning step
// @access  Private
router.put('/step/:stepId', protect, async (req, res) => {
    try {
        const { stepId } = req.params;
        const { progress: stepProgress, lessonId } = req.body;

        let userProgress = await Progress.findOne({ user: req.user._id });

        if (!userProgress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        // Find and update the step
        const stepIndex = userProgress.learningPath.findIndex(
            s => s.stepId === parseInt(stepId)
        );

        if (stepIndex === -1) {
            return res.status(404).json({ message: 'Step not found' });
        }

        const step = userProgress.learningPath[stepIndex];

        // Update step progress
        if (stepProgress !== undefined) {
            step.progress = Math.min(100, Math.max(0, stepProgress));
        }

        // Record completed lesson
        if (lessonId && !step.completedLessons.find(l => l.lessonId === lessonId)) {
            step.completedLessons.push({ lessonId });
        }

        // Check if step is completed
        if (step.progress >= 100 && step.status !== 'completed') {
            step.status = 'completed';
            step.completedAt = new Date();

            // Award XP
            const xpGained = 50 + (stepIndex * 25); // More XP for later steps
            userProgress.totalXP += xpGained;

            // Update user XP
            await User.findByIdAndUpdate(req.user._id, { $inc: { xp: xpGained } });

            // Unlock next step
            if (stepIndex + 1 < userProgress.learningPath.length) {
                userProgress.learningPath[stepIndex + 1].status = 'current';
                userProgress.learningPath[stepIndex + 1].startedAt = new Date();
            }
        }

        await userProgress.save();
        res.json(userProgress);
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ message: 'Error updating progress' });
    }
});

// @route   POST /api/progress/quiz
// @desc    Record quiz result
// @access  Private
router.post('/quiz', protect, async (req, res) => {
    try {
        const { quizId, topic, score, totalQuestions } = req.body;

        let progress = await Progress.findOne({ user: req.user._id });

        if (!progress) {
            return res.status(404).json({ message: 'Progress not found' });
        }

        // Add quiz result
        progress.quizzes.push({
            quizId,
            topic,
            score,
            totalQuestions
        });

        // Calculate XP for quiz (10 XP per correct answer)
        const xpGained = score * 10;
        progress.totalXP += xpGained;

        // Update user XP
        await User.findByIdAndUpdate(req.user._id, { $inc: { xp: xpGained } });

        await progress.save();

        res.json({
            progress,
            xpGained,
            percentage: Math.round((score / totalQuestions) * 100)
        });
    } catch (error) {
        console.error('Record quiz error:', error);
        res.status(500).json({ message: 'Error recording quiz result' });
    }
});

// @route   GET /api/progress/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const progress = await Progress.findOne({ user: req.user._id });
        const user = await User.findById(req.user._id);

        if (!progress || !user) {
            return res.status(404).json({ message: 'Data not found' });
        }

        // Calculate stats
        const completedSteps = progress.learningPath.filter(s => s.status === 'completed').length;
        const totalSteps = progress.learningPath.length;
        const overallProgress = Math.round((completedSteps / totalSteps) * 100);

        // Get average quiz score
        const quizScores = progress.quizzes.map(q => (q.score / q.totalQuestions) * 100);
        const avgQuizScore = quizScores.length > 0
            ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
            : 0;

        // Get last quiz score
        const lastQuiz = progress.quizzes[progress.quizzes.length - 1];
        const lastQuizScore = lastQuiz
            ? Math.round((lastQuiz.score / lastQuiz.totalQuestions) * 100)
            : 0;

        res.json({
            xp: progress.totalXP,
            streak: user.streak,
            badges: user.badges,
            overallProgress,
            completedSteps,
            totalSteps,
            avgQuizScore,
            lastQuizScore,
            totalQuizzes: progress.quizzes.length
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
});

export default router;

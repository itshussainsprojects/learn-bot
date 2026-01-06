import mongoose from 'mongoose';

const learningStepSchema = new mongoose.Schema({
    stepId: {
        type: Number,
        required: true
    },
    title: String,
    status: {
        type: String,
        enum: ['locked', 'current', 'completed'],
        default: 'locked'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completedLessons: [{
        lessonId: Number,
        completedAt: { type: Date, default: Date.now }
    }],
    startedAt: Date,
    completedAt: Date
});

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    learningPath: [learningStepSchema],
    quizzes: [{
        quizId: String,
        topic: String,
        score: Number,
        totalQuestions: Number,
        completedAt: { type: Date, default: Date.now }
    }],
    totalXP: {
        type: Number,
        default: 0
    },
    completedTopics: [{
        type: String
    }],
    currentTopic: {
        type: String,
        default: 'javascript-fundamentals'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

progressSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Progress = mongoose.model('Progress', progressSchema);
export default Progress;

import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Note title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    content: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['javascript', 'react', 'typescript', 'general', 'quiz'],
        default: 'general'
    },
    tags: [{
        type: String,
        trim: true
    }],
    isPinned: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: 'default'
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

// Update the updatedAt field on save
noteSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Note = mongoose.model('Note', noteSchema);
export default Note;

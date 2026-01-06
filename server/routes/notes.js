import express from 'express';
import Note from '../models/Note.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notes
// @desc    Get all notes for current user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id })
            .sort({ isPinned: -1, updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({ message: 'Error fetching notes' });
    }
});

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { title, content, category, tags, color } = req.body;

        const note = await Note.create({
            user: req.user._id,
            title: title || 'Untitled Note',
            content: content || '',
            category: category || 'general',
            tags: tags || [],
            color: color || 'default'
        });

        res.status(201).json(note);
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({ message: 'Error creating note' });
    }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { title, content, category, tags, isPinned, color } = req.body;

        const note = await Note.findOne({ _id: req.params.id, user: req.user._id });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        // Update fields
        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (category !== undefined) note.category = category;
        if (tags !== undefined) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;
        if (color !== undefined) note.color = color;

        await note.save();
        res.json(note);
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({ message: 'Error updating note' });
    }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({ message: 'Error deleting note' });
    }
});

export default router;

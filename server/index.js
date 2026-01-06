import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import notesRoutes from './routes/notes.js';
import progressRoutes from './routes/progress.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: '🚀 LearnBotX API is running!',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            chat: '/api/chat',
            notes: '/api/notes',
            progress: '/api/progress'
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/progress', progressRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║   🤖 LearnBotX Server Running!            ║
║                                           ║
║   📍 http://localhost:${PORT}               ║
║                                           ║
║   Available Endpoints:                    ║
║   • POST /api/auth/register               ║
║   • POST /api/auth/login                  ║
║   • POST /api/chat/message                ║
║   • GET  /api/progress                    ║
║   • GET  /api/notes                       ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

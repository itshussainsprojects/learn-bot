import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Chat from '../models/Chat.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize Gemini AI
let genAI;
let model;

const initializeGemini = () => {
    if (!genAI && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here') {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }
};

// System prompt for LearnBotX AI
const SYSTEM_PROMPT = `You are LearnBotX, an expert AI learning assistant specialized in web development and programming education. 

Your personality:
- Friendly, encouraging, and patient
- You celebrate progress and motivate learners
- You use emojis occasionally to keep things engaging 🚀
- You explain concepts clearly with examples

Your expertise includes:
- JavaScript (ES6+), TypeScript
- React, Vue, Angular
- Node.js, Express
- HTML, CSS, Tailwind
- Git, GitHub
- Data structures and algorithms
- Web development best practices

When helping users:
1. Break down complex topics into digestible chunks
2. Provide code examples when relevant (use markdown code blocks)
3. Suggest practice exercises
4. Connect concepts to real-world applications
5. Encourage questions and curiosity

Keep responses concise but informative. If asked about topics outside programming/web development, politely redirect to learning topics.`;

// @route   POST /api/chat/message
// @desc    Send a message and get AI response
// @access  Private
router.post('/message', protect, async (req, res) => {
    try {
        const { message, chatId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: 'Message is required' });
        }

        initializeGemini();

        let chat;

        // Find or create chat
        if (chatId) {
            chat = await Chat.findOne({ _id: chatId, user: req.user._id });
        }

        if (!chat) {
            chat = new Chat({
                user: req.user._id,
                title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
                messages: []
            });
        }

        // Add user message
        chat.messages.push({
            role: 'user',
            content: message
        });

        let aiResponse;

        // Check if Gemini is configured
        if (model) {
            try {
                // Build conversation history for context
                const conversationHistory = chat.messages.map(m =>
                    `${m.role === 'user' ? 'User' : 'LearnBotX'}: ${m.content}`
                ).join('\n\n');

                const prompt = `${SYSTEM_PROMPT}\n\nConversation so far:\n${conversationHistory}\n\nRespond to the user's latest message as LearnBotX:`;

                const result = await model.generateContent(prompt);
                aiResponse = result.response.text();
            } catch (aiError) {
                console.error('Gemini API error:', aiError);
                aiResponse = "I'm having trouble connecting to my AI brain right now. Let me give you a helpful response anyway!\n\nWhat topic would you like to explore? I can help with:\n- JavaScript fundamentals\n- React development\n- TypeScript\n- And much more!";
            }
        } else {
            // Fallback responses when Gemini is not configured
            aiResponse = generateFallbackResponse(message);
        }

        // Add AI response
        chat.messages.push({
            role: 'assistant',
            content: aiResponse
        });

        await chat.save();

        res.json({
            chatId: chat._id,
            message: {
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ message: 'Error processing chat message' });
    }
});

// @route   GET /api/chat/history
// @desc    Get user's chat history
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user._id })
            .sort({ updatedAt: -1 })
            .select('_id title updatedAt messages')
            .limit(20);

        res.json(chats);
    } catch (error) {
        console.error('Get chat history error:', error);
        res.status(500).json({ message: 'Error fetching chat history' });
    }
});

// @route   GET /api/chat/:chatId
// @desc    Get a specific chat
// @access  Private
router.get('/:chatId', protect, async (req, res) => {
    try {
        const chat = await Chat.findOne({
            _id: req.params.chatId,
            user: req.user._id
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Get chat error:', error);
        res.status(500).json({ message: 'Error fetching chat' });
    }
});

// @route   DELETE /api/chat/:chatId
// @desc    Delete a chat
// @access  Private
router.delete('/:chatId', protect, async (req, res) => {
    try {
        const chat = await Chat.findOneAndDelete({
            _id: req.params.chatId,
            user: req.user._id
        });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('Delete chat error:', error);
        res.status(500).json({ message: 'Error deleting chat' });
    }
});

// Fallback responses when Gemini is not configured
function generateFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('closure') || lowerMessage.includes('closures')) {
        return `**Closures in JavaScript** 🎯

A closure is a function that has access to variables from its outer (enclosing) scope, even after that outer function has returned.

\`\`\`javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
counter(); // 1
counter(); // 2
\`\`\`

Closures are powerful for:
- **Data privacy** - Creating private variables
- **State persistence** - Maintaining state between calls
- **Function factories** - Creating specialized functions

Would you like me to explain more with examples?`;
    }

    if (lowerMessage.includes('hook') || lowerMessage.includes('react')) {
        return `**React Hooks Explained** ⚛️

Hooks are functions that let you use state and other React features in functional components.

**useState** - For state management
\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

**useEffect** - For side effects
\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\`

**Key Rules:**
1. Only call hooks at the top level
2. Only call hooks from React functions

Need help with a specific hook?`;
    }

    if (lowerMessage.includes('typescript') || lowerMessage.includes('types')) {
        return `**TypeScript Basics** 📘

TypeScript adds static typing to JavaScript, helping catch errors early!

\`\`\`typescript
// Basic types
let name: string = "LearnBotX";
let age: number = 1;
let isActive: boolean = true;

// Arrays
let skills: string[] = ["React", "Node"];

// Interfaces
interface User {
  name: string;
  email: string;
  level?: string; // optional
}
\`\`\`

TypeScript helps you:
- Catch bugs at compile time 🐛
- Better IDE autocomplete 💡
- Self-documenting code 📝

What aspect would you like to explore?`;
    }

    return `Great question! 🚀

I'm here to help you learn programming and web development. I can assist with:

- **JavaScript** - ES6+, closures, async/await
- **React** - Components, hooks, state management
- **TypeScript** - Types, interfaces, generics
- **Node.js** - Express, APIs, databases
- **And more!**

What would you like to learn about today?`;
}

export default router;

import { DEMO_MODE, DEMO_USERS, DEMO_NOTES, DEMO_CHATS, getDemoStats, DEMO_PROGRESS } from './demo-data';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Check if we should use demo mode (backend unreachable or DEMO_MODE is true)
let useDemoMode = DEMO_MODE;

// API request helper with fallback to demo mode
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    // If in demo mode, don't even try the API
    if (useDemoMode) {
        throw new Error('DEMO_MODE');
    }

    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error: any) {
        // If network error, switch to demo mode
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            useDemoMode = true;
            throw new Error('DEMO_MODE');
        }
        throw error;
    }
}

// Demo mode auth functions
function demoLogin(email: string, password: string): AuthResponse | null {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token: 'demo-token-' + user._id,
        };
    }
    return null;
}

function demoRegister(name: string, email: string, password: string, level: string): AuthResponse {
    const newUser = {
        _id: 'demo-user-' + Date.now(),
        name,
        email,
        level: level || 'beginner',
        xp: 0,
        streak: { current: 1, longest: 1, lastActive: new Date().toISOString() },
        badges: [],
        progress: { javascript: 0, react: 0, typescript: 0 },
        token: 'demo-token-' + Date.now(),
    };
    return newUser;
}

function getDemoUser(): User | null {
    const token = getToken();
    if (token?.startsWith('demo-token-')) {
        const userId = token.replace('demo-token-', '');
        const user = DEMO_USERS.find(u => u._id === userId);
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        // Return first demo user as fallback
        const { password: _, ...firstUser } = DEMO_USERS[0];
        return firstUser;
    }
    return null;
}

// Auth API
export const authAPI = {
    register: async (userData: { name: string; email: string; password: string; level?: string }): Promise<AuthResponse> => {
        try {
            return await apiRequest<AuthResponse>('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                return demoRegister(userData.name, userData.email, userData.password, userData.level || 'beginner');
            }
            throw error;
        }
    },

    login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
        try {
            return await apiRequest<AuthResponse>('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                const user = demoLogin(credentials.email, credentials.password);
                if (user) return user;
                throw new Error('Invalid email or password');
            }
            throw error;
        }
    },

    getMe: async (): Promise<User> => {
        try {
            return await apiRequest<User>('/auth/me');
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                const user = getDemoUser();
                if (user) return user;
                throw new Error('Not authenticated');
            }
            throw error;
        }
    },
};

// Chat API
export const chatAPI = {
    sendMessage: async (message: string, chatId?: string): Promise<ChatResponse> => {
        try {
            return await apiRequest<ChatResponse>('/chat/message', {
                method: 'POST',
                body: JSON.stringify({ message, chatId }),
            });
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                // Demo AI responses
                const responses = [
                    "That's a great question! In demo mode, I can provide basic responses. The key concept here involves understanding the fundamentals first, then building up to more complex topics.",
                    "I'm running in demo mode right now. For full AI-powered responses, please connect to the backend. But I can tell you that practice is the best way to learn programming!",
                    "Demo mode active! This is a simulated response. When connected to the backend, you'll get real AI-powered tutoring with Gemini.",
                ];
                return {
                    chatId: chatId || 'demo-chat-' + Date.now(),
                    message: {
                        role: 'assistant',
                        content: responses[Math.floor(Math.random() * responses.length)],
                        timestamp: new Date().toISOString(),
                    },
                };
            }
            throw error;
        }
    },

    getHistory: async (): Promise<ChatHistory[]> => {
        try {
            return await apiRequest<ChatHistory[]>('/chat/history');
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                return DEMO_CHATS;
            }
            throw error;
        }
    },

    getChat: async (chatId: string): Promise<Chat> => {
        try {
            return await apiRequest<Chat>(`/chat/${chatId}`);
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                const chat = DEMO_CHATS.find(c => c._id === chatId);
                if (chat) return chat;
                throw new Error('Chat not found');
            }
            throw error;
        }
    },

    deleteChat: async (chatId: string): Promise<{ message: string }> => {
        try {
            return await apiRequest<{ message: string }>(`/chat/${chatId}`, { method: 'DELETE' });
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                return { message: 'Chat deleted (demo mode)' };
            }
            throw error;
        }
    },
};

// Notes API with demo storage
let demoNotes = [...DEMO_NOTES];

export const notesAPI = {
    getAll: async (): Promise<Note[]> => {
        try {
            return await apiRequest<Note[]>('/notes');
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                return demoNotes;
            }
            throw error;
        }
    },

    create: async (note: Partial<Note>): Promise<Note> => {
        try {
            return await apiRequest<Note>('/notes', {
                method: 'POST',
                body: JSON.stringify(note),
            });
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                const newNote: Note = {
                    _id: 'note-' + Date.now(),
                    title: note.title || 'Untitled',
                    content: note.content || '',
                    category: note.category || 'General',
                    tags: note.tags || [],
                    isPinned: false,
                    color: note.color || 'cyan',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                demoNotes.push(newNote);
                return newNote;
            }
            throw error;
        }
    },

    update: async (id: string, note: Partial<Note>): Promise<Note> => {
        try {
            return await apiRequest<Note>(`/notes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(note),
            });
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                const index = demoNotes.findIndex(n => n._id === id);
                if (index >= 0) {
                    demoNotes[index] = { ...demoNotes[index], ...note, updatedAt: new Date().toISOString() };
                    return demoNotes[index];
                }
                throw new Error('Note not found');
            }
            throw error;
        }
    },

    delete: async (id: string): Promise<{ message: string }> => {
        try {
            return await apiRequest<{ message: string }>(`/notes/${id}`, { method: 'DELETE' });
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                demoNotes = demoNotes.filter(n => n._id !== id);
                return { message: 'Note deleted (demo mode)' };
            }
            throw error;
        }
    },
};

// Progress API
export const progressAPI = {
    get: async (): Promise<Progress> => {
        try {
            return await apiRequest<Progress>('/progress');
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                return DEMO_PROGRESS;
            }
            throw error;
        }
    },

    updateStep: async (stepId: number, data: { progress?: number; lessonId?: number }): Promise<Progress> => {
        try {
            return await apiRequest<Progress>(`/progress/step/${stepId}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                return DEMO_PROGRESS;
            }
            throw error;
        }
    },

    recordQuiz: async (quizData: { quizId: string; topic: string; score: number; totalQuestions: number }): Promise<QuizResult> => {
        try {
            return await apiRequest<QuizResult>('/progress/quiz', {
                method: 'POST',
                body: JSON.stringify(quizData),
            });
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                const percentage = Math.round((quizData.score / quizData.totalQuestions) * 100);
                const xpGained = quizData.score * 20;
                return {
                    progress: DEMO_PROGRESS,
                    xpGained,
                    percentage,
                };
            }
            throw error;
        }
    },

    getStats: async (): Promise<Stats> => {
        try {
            return await apiRequest<Stats>('/progress/stats');
        } catch (error: any) {
            if (error.message === 'DEMO_MODE' || useDemoMode) {
                return getDemoStats('demo');
            }
            throw error;
        }
    },
};

// Types
export interface User {
    _id: string;
    name: string;
    email: string;
    level: string;
    xp: number;
    streak: {
        current: number;
        longest: number;
        lastActive: string;
    };
    badges: Array<{ id: string; name: string; earnedAt: string }>;
    progress: {
        javascript: number;
        react: number;
        typescript: number;
    };
}

export interface AuthResponse extends User {
    token: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export interface ChatResponse {
    chatId: string;
    message: ChatMessage;
}

export interface Chat {
    _id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: string;
    updatedAt: string;
}

export interface ChatHistory {
    _id: string;
    title: string;
    updatedAt: string;
    messages: ChatMessage[];
}

export interface Note {
    _id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    isPinned: boolean;
    color: string;
    createdAt: string;
    updatedAt: string;
}

export interface LearningStep {
    stepId: number;
    title: string;
    status: 'locked' | 'current' | 'completed';
    progress: number;
    completedLessons: Array<{ lessonId: number; completedAt: string }>;
    startedAt?: string;
    completedAt?: string;
}

export interface Progress {
    _id: string;
    learningPath: LearningStep[];
    quizzes: Array<{
        quizId: string;
        topic: string;
        score: number;
        totalQuestions: number;
        completedAt: string;
    }>;
    totalXP: number;
    currentTopic: string;
}

export interface QuizResult {
    progress: Progress;
    xpGained: number;
    percentage: number;
}

export interface Stats {
    xp: number;
    streak: {
        current: number;
        longest: number;
    };
    badges: Array<{ id: string; name: string; earnedAt: string }>;
    overallProgress: number;
    completedSteps: number;
    totalSteps: number;
    avgQuizScore: number;
    lastQuizScore: number;
    totalQuizzes: number;
}

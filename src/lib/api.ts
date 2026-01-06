const API_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// API request helper
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// Auth API
export const authAPI = {
    register: (userData: { name: string; email: string; password: string; level?: string }) =>
        apiRequest<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        }),

    login: (credentials: { email: string; password: string }) =>
        apiRequest<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        }),

    getMe: () => apiRequest<User>('/auth/me'),
};

// Chat API
export const chatAPI = {
    sendMessage: (message: string, chatId?: string) =>
        apiRequest<ChatResponse>('/chat/message', {
            method: 'POST',
            body: JSON.stringify({ message, chatId }),
        }),

    getHistory: () => apiRequest<ChatHistory[]>('/chat/history'),

    getChat: (chatId: string) => apiRequest<Chat>(`/chat/${chatId}`),

    deleteChat: (chatId: string) =>
        apiRequest<{ message: string }>(`/chat/${chatId}`, { method: 'DELETE' }),
};

// Notes API
export const notesAPI = {
    getAll: () => apiRequest<Note[]>('/notes'),

    create: (note: Partial<Note>) =>
        apiRequest<Note>('/notes', {
            method: 'POST',
            body: JSON.stringify(note),
        }),

    update: (id: string, note: Partial<Note>) =>
        apiRequest<Note>(`/notes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(note),
        }),

    delete: (id: string) =>
        apiRequest<{ message: string }>(`/notes/${id}`, { method: 'DELETE' }),
};

// Progress API
export const progressAPI = {
    get: () => apiRequest<Progress>('/progress'),

    updateStep: (stepId: number, data: { progress?: number; lessonId?: number }) =>
        apiRequest<Progress>(`/progress/step/${stepId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    recordQuiz: (quizData: { quizId: string; topic: string; score: number; totalQuestions: number }) =>
        apiRequest<QuizResult>('/progress/quiz', {
            method: 'POST',
            body: JSON.stringify(quizData),
        }),

    getStats: () => apiRequest<Stats>('/progress/stats'),
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

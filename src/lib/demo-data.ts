// Demo mode configuration - for when backend is not available (e.g., Vercel frontend-only deployment)
export const DEMO_MODE = true; // Set to false when backend is deployed

// Demo user credentials
export const DEMO_USERS = [
    {
        _id: 'demo-user-1',
        name: 'Umer',
        email: 'umer00@test.com',
        password: 'umer123',
        level: 'intermediate',
        xp: 1250,
        streak: {
            current: 7,
            longest: 14,
            lastActive: new Date().toISOString(),
        },
        badges: [
            { id: 'first-quiz', name: 'First Quiz', earnedAt: '2024-01-01' },
            { id: 'week-streak', name: 'Week Warrior', earnedAt: '2024-01-07' },
            { id: 'quiz-master', name: 'Quiz Master', earnedAt: '2024-01-15' },
        ],
        progress: {
            javascript: 75,
            react: 45,
            typescript: 30,
        },
    },
    {
        _id: 'demo-user-2',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test123',
        level: 'beginner',
        xp: 350,
        streak: {
            current: 3,
            longest: 5,
            lastActive: new Date().toISOString(),
        },
        badges: [
            { id: 'first-quiz', name: 'First Quiz', earnedAt: '2024-01-01' },
        ],
        progress: {
            javascript: 40,
            react: 10,
            typescript: 0,
        },
    },
];

// Demo notes
export const DEMO_NOTES = [
    {
        _id: 'note-1',
        title: 'JavaScript Array Methods',
        content: 'map(), filter(), reduce() are essential for React development. Always remember to return a new array!',
        category: 'JavaScript',
        tags: ['arrays', 'methods'],
        isPinned: true,
        color: 'cyan',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:00Z',
    },
    {
        _id: 'note-2',
        title: 'React Hooks Rules',
        content: '1. Only call hooks at the top level\n2. Only call hooks from React functions\n3. useEffect runs after every render',
        category: 'React',
        tags: ['hooks', 'rules'],
        isPinned: false,
        color: 'purple',
        createdAt: '2024-01-11T14:00:00Z',
        updatedAt: '2024-01-11T14:00:00Z',
    },
    {
        _id: 'note-3',
        title: 'TypeScript Basics',
        content: 'Types: string, number, boolean, array, object. Use interfaces for object shapes.',
        category: 'TypeScript',
        tags: ['types', 'basics'],
        isPinned: false,
        color: 'blue',
        createdAt: '2024-01-12T09:00:00Z',
        updatedAt: '2024-01-12T09:00:00Z',
    },
];

// Demo chat history
export const DEMO_CHATS = [
    {
        _id: 'chat-1',
        title: 'JavaScript Closures',
        messages: [
            { role: 'user' as const, content: 'Can you explain closures in JavaScript?', timestamp: '2024-01-10T10:00:00Z' },
            { role: 'assistant' as const, content: 'A closure is a function that has access to variables from its outer (enclosing) function scope, even after the outer function has returned. This is one of the most powerful features in JavaScript!\n\nExample:\n```javascript\nfunction outer() {\n  let count = 0;\n  return function inner() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = outer();\nconsole.log(counter()); // 1\nconsole.log(counter()); // 2\n```\n\nThe inner function "remembers" the count variable even after outer() has finished executing.', timestamp: '2024-01-10T10:00:05Z' },
        ],
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-10T10:00:05Z',
    },
];

// Demo stats
export const getDemoStats = (userId: string) => ({
    xp: 1250,
    streak: {
        current: 7,
        longest: 14,
    },
    badges: [
        { id: 'first-quiz', name: 'First Quiz', earnedAt: '2024-01-01' },
        { id: 'week-streak', name: 'Week Warrior', earnedAt: '2024-01-07' },
        { id: 'quiz-master', name: 'Quiz Master', earnedAt: '2024-01-15' },
    ],
    overallProgress: 50,
    completedSteps: 3,
    totalSteps: 6,
    avgQuizScore: 85,
    lastQuizScore: 90,
    totalQuizzes: 12,
});

// Demo progress
export const DEMO_PROGRESS = {
    _id: 'progress-1',
    learningPath: [
        { stepId: 1, title: 'JavaScript Fundamentals', status: 'completed' as const, progress: 100, completedLessons: [], completedAt: '2024-01-05' },
        { stepId: 2, title: 'Functions & Scope', status: 'completed' as const, progress: 100, completedLessons: [], completedAt: '2024-01-08' },
        { stepId: 3, title: 'Arrays & Objects', status: 'current' as const, progress: 60, completedLessons: [], startedAt: '2024-01-09' },
        { stepId: 4, title: 'Async JavaScript', status: 'locked' as const, progress: 0, completedLessons: [] },
        { stepId: 5, title: 'DOM Manipulation', status: 'locked' as const, progress: 0, completedLessons: [] },
        { stepId: 6, title: 'React Basics', status: 'locked' as const, progress: 0, completedLessons: [] },
    ],
    quizzes: [
        { quizId: 'quiz-1', topic: 'javascript', score: 4, totalQuestions: 5, completedAt: '2024-01-05' },
        { quizId: 'quiz-2', topic: 'javascript', score: 5, totalQuestions: 5, completedAt: '2024-01-06' },
    ],
    totalXP: 1250,
    currentTopic: 'javascript',
};

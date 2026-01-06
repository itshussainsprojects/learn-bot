import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  Brain,
  ChevronRight,
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trophy,
  Zap,
  Timer,
  RotateCcw,
  Star,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { progressAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const topics = [
  { id: 'javascript', name: 'JavaScript', icon: '🟨', questions: 20, color: 'from-yellow-500 to-orange-500' },
  { id: 'react', name: 'React', icon: '⚛️', questions: 15, color: 'from-cyan-400 to-blue-500' },
  { id: 'typescript', name: 'TypeScript', icon: '🔷', questions: 18, color: 'from-blue-400 to-indigo-500' },
  { id: 'python', name: 'Python', icon: '🐍', questions: 22, color: 'from-green-400 to-emerald-500' },
  { id: 'nodejs', name: 'Node.js', icon: '💚', questions: 16, color: 'from-green-500 to-lime-500' },
  { id: 'css', name: 'CSS & Tailwind', icon: '🎨', questions: 14, color: 'from-pink-400 to-purple-500' },
];

const difficulties = [
  { id: 'easy', name: 'Easy', color: 'text-success', bgColor: 'bg-success/20', description: 'Perfect for beginners', xpBonus: 1 },
  { id: 'medium', name: 'Medium', color: 'text-warning', bgColor: 'bg-warning/20', description: 'Test your skills', xpBonus: 1.5 },
  { id: 'hard', name: 'Hard', color: 'text-coral', bgColor: 'bg-coral/20', description: 'Challenge yourself', xpBonus: 2 },
];

// Extended question bank
const questionBank: Record<string, any[]> = {
  javascript: [
    {
      question: 'What is the output of console.log(typeof null)?',
      options: ['"null"', '"object"', '"undefined"', '"number"'],
      correct: 1,
      explanation: 'This is a famous JavaScript quirk. typeof null returns "object" due to a legacy bug in JavaScript.'
    },
    {
      question: 'Which method removes the last element from an array?',
      options: ['shift()', 'unshift()', 'pop()', 'push()'],
      correct: 2,
      explanation: 'pop() removes and returns the last element from an array, modifying the original array.'
    },
    {
      question: 'What does the "const" keyword do in JavaScript?',
      options: ['Creates a mutable variable', 'Creates a block-scoped constant', 'Creates a global variable', 'Creates a hoisted variable'],
      correct: 1,
      explanation: 'const creates a block-scoped, read-only named constant. The value cannot be reassigned.'
    },
    {
      question: 'What is a closure in JavaScript?',
      options: ['A way to close browser tabs', 'A function with access to its outer scope', 'A method to close database connections', 'A type of loop'],
      correct: 1,
      explanation: 'A closure is a function that has access to variables from its outer (enclosing) function scope even after the outer function has returned.'
    },
    {
      question: 'Which operator is used for strict equality comparison?',
      options: ['==', '===', '!=', '!=='],
      correct: 1,
      explanation: '=== (strict equality) compares both value and type, while == (loose equality) performs type coercion.'
    },
  ],
  react: [
    {
      question: 'Which hook is used for side effects in React?',
      options: ['useState', 'useEffect', 'useContext', 'useReducer'],
      correct: 1,
      explanation: 'useEffect is the React hook designed for handling side effects like data fetching, subscriptions, or DOM manipulation.'
    },
    {
      question: 'What is the virtual DOM?',
      options: ['A browser API', 'A lightweight copy of the actual DOM', 'A CSS framework', 'A database'],
      correct: 1,
      explanation: 'The virtual DOM is a lightweight JavaScript representation of the actual DOM that React uses for efficient updates.'
    },
    {
      question: 'How do you pass data from parent to child component?',
      options: ['Using state', 'Using props', 'Using context', 'Using refs'],
      correct: 1,
      explanation: 'Props (short for properties) are used to pass data from parent components to child components in React.'
    },
    {
      question: 'What hook would you use for complex state logic?',
      options: ['useState', 'useEffect', 'useReducer', 'useMemo'],
      correct: 2,
      explanation: 'useReducer is preferred when you have complex state logic involving multiple sub-values or when the next state depends on the previous one.'
    },
    {
      question: 'What is JSX?',
      options: ['A database query language', 'JavaScript XML syntax extension', 'A CSS preprocessor', 'A testing framework'],
      correct: 1,
      explanation: 'JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside JavaScript files.'
    },
  ],
  typescript: [
    {
      question: 'What is TypeScript?',
      options: ['A new programming language', 'A typed superset of JavaScript', 'A JavaScript framework', 'A CSS preprocessor'],
      correct: 1,
      explanation: 'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.'
    },
    {
      question: 'Which keyword is used to define an interface?',
      options: ['class', 'type', 'interface', 'struct'],
      correct: 2,
      explanation: 'The interface keyword is used to define the structure of an object in TypeScript.'
    },
    {
      question: 'What does the "any" type represent?',
      options: ['Any number', 'Any string', 'Any value of any type', 'Any array'],
      correct: 2,
      explanation: 'The any type allows a variable to hold any value, essentially opting out of type checking.'
    },
    {
      question: 'How do you make a property optional in an interface?',
      options: ['Using !', 'Using ?', 'Using *', 'Using @'],
      correct: 1,
      explanation: 'The ? symbol after a property name makes it optional in TypeScript interfaces.'
    },
    {
      question: 'What is a generic in TypeScript?',
      options: ['A default value', 'A type that works with multiple types', 'A global variable', 'A constant'],
      correct: 1,
      explanation: 'Generics allow you to create reusable components that work with multiple types rather than a single one.'
    },
  ],
};

// Fallback questions
const defaultQuestions = [
  {
    question: 'What is the purpose of version control systems?',
    options: ['To track changes in code', 'To compile code', 'To run tests', 'To deploy applications'],
    correct: 0,
    explanation: 'Version control systems like Git help track changes in code over time, enabling collaboration and history management.'
  },
  {
    question: 'What does API stand for?',
    options: ['Application Programming Interface', 'Advanced Protocol Integration', 'Automated Process Interface', 'Application Protocol Integration'],
    correct: 0,
    explanation: 'API stands for Application Programming Interface - a set of protocols for building and integrating application software.'
  },
  {
    question: 'What is the main purpose of a database?',
    options: ['To style websites', 'To store and retrieve data', 'To compile code', 'To host websites'],
    correct: 1,
    explanation: 'Databases are designed to store, organize, and retrieve data efficiently.'
  },
];

type QuizState = 'setup' | 'playing' | 'result';

export default function Quiz() {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState === 'playing') {
      timer = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [quizState]);

  const startQuiz = () => {
    if (selectedTopic && selectedDifficulty) {
      // Get questions for selected topic or use defaults
      const topicQuestions = questionBank[selectedTopic] || defaultQuestions;
      // Shuffle and select 5 questions
      const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
      setQuestions(shuffled.slice(0, 5));

      setQuizState('playing');
      setCurrentQuestion(0);
      setScore(0);
      setAnswers([]);
      setTimeElapsed(0);
    }
  };

  const handleAnswer = (index: number) => {
    if (showAnswer) return;
    setSelectedAnswer(index);
    setShowAnswer(true);
    const isCorrect = index === questions[currentQuestion].correct;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, isCorrect]);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizState('result');
    setIsSubmitting(true);

    try {
      // Submit quiz results to backend
      const difficulty = difficulties.find(d => d.id === selectedDifficulty);
      const result = await progressAPI.recordQuiz({
        quizId: `${selectedTopic}-${Date.now()}`,
        topic: selectedTopic || 'general',
        score: score,
        totalQuestions: questions.length
      });

      toast({
        title: `+${result.xpGained} XP Earned! 🎉`,
        description: `You scored ${result.percentage}% on this quiz`,
      });
    } catch (error) {
      // Still show results even if API fails
      console.error('Failed to submit quiz result:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setQuizState('setup');
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setAnswers([]);
    setQuestions([]);
    setTimeElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return { emoji: '🏆', text: 'Perfect Score!' };
    if (percentage >= 80) return { emoji: '🌟', text: 'Excellent Work!' };
    if (percentage >= 60) return { emoji: '💪', text: 'Good Job!' };
    if (percentage >= 40) return { emoji: '📚', text: 'Keep Learning!' };
    return { emoji: '🔄', text: 'Try Again!' };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {/* Setup Phase */}
            {quizState === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto"
              >
                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-coral mx-auto mb-6 flex items-center justify-center relative"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(0, 245, 255, 0.3)',
                        '0 0 40px rgba(168, 85, 247, 0.3)',
                        '0 0 20px rgba(0, 245, 255, 0.3)',
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Brain className="w-10 h-10 text-primary-foreground" />
                  </motion.div>
                  <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                    Start Your <span className="gradient-text">Quiz</span>
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Select a topic and difficulty to test your knowledge
                  </p>
                </div>

                {/* Topic Selection */}
                <div className="mb-10">
                  <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Choose a Topic
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {topics.map((topic, index) => (
                      <motion.button
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedTopic(topic.id)}
                        className={`glass-card p-6 text-left transition-all relative overflow-hidden ${selectedTopic === topic.id
                            ? 'border-2 border-primary bg-primary/10'
                            : 'hover:bg-white/10'
                          }`}
                      >
                        {selectedTopic === topic.id && (
                          <motion.div
                            layoutId="topic-selected"
                            className="absolute inset-0 bg-primary/10"
                          />
                        )}
                        <div className="relative z-10">
                          <span className="text-4xl mb-3 block">{topic.icon}</span>
                          <h3 className="font-semibold mb-1">{topic.name}</h3>
                          <p className="text-xs text-muted-foreground">{topic.questions} questions</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div className="mb-10">
                  <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-warning" />
                    Select Difficulty
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {difficulties.map((diff, index) => (
                      <motion.button
                        key={diff.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedDifficulty(diff.id)}
                        className={`glass-card p-6 text-left transition-all ${selectedDifficulty === diff.id
                            ? 'border-2 border-primary bg-primary/10'
                            : 'hover:bg-white/10'
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-10 h-10 rounded-xl ${diff.bgColor} flex items-center justify-center`}>
                            <Star className={`w-5 h-5 ${diff.color}`} />
                          </div>
                          <h3 className={`font-semibold ${diff.color}`}>{diff.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{diff.description}</p>
                        <p className="text-xs text-primary mt-2">XP Bonus: {diff.xpBonus}x</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    variant="hero"
                    size="xl"
                    onClick={startQuiz}
                    disabled={!selectedTopic || !selectedDifficulty}
                    className="group text-lg px-10 py-6 h-auto"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Start Quiz
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </motion.div>
            )}

            {/* Playing Phase */}
            {quizState === 'playing' && questions.length > 0 && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-3xl mx-auto"
              >
                {/* Header with timer */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5">
                      <Timer className="w-4 h-4 text-primary" />
                      <span className="text-sm font-mono">{formatTime(timeElapsed)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20">
                    <Trophy className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-primary">{score}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                      className="h-full bg-gradient-to-r from-primary via-accent to-coral rounded-full"
                    />
                  </div>
                </div>

                {/* Question Card */}
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-8 mb-6"
                >
                  <h2 className="font-display text-xl md:text-2xl font-semibold mb-8">
                    {questions[currentQuestion].question}
                  </h2>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option: string, index: number) => {
                      const isCorrect = index === questions[currentQuestion].correct;
                      const isSelected = selectedAnswer === index;

                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: showAnswer ? 1 : 1.01 }}
                          whileTap={{ scale: showAnswer ? 1 : 0.99 }}
                          onClick={() => handleAnswer(index)}
                          disabled={showAnswer}
                          className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 ${showAnswer
                              ? isCorrect
                                ? 'bg-success/20 border-2 border-success'
                                : isSelected
                                  ? 'bg-destructive/20 border-2 border-destructive'
                                  : 'bg-white/5 border border-white/10'
                              : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30'
                            }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold ${showAnswer && isCorrect
                              ? 'bg-success text-primary-foreground'
                              : showAnswer && isSelected
                                ? 'bg-destructive text-primary-foreground'
                                : 'bg-white/10'
                            }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {showAnswer && isCorrect && <CheckCircle2 className="w-6 h-6 text-success" />}
                          {showAnswer && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-destructive" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Explanation */}
                <AnimatePresence>
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      className="glass-card p-6 mb-6 border-l-4 border-primary overflow-hidden"
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-2">AI Explanation</h4>
                          <p className="text-muted-foreground text-sm">
                            {questions[currentQuestion].explanation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <Button variant="hero" size="lg" onClick={nextQuestion} className="group">
                      {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Result Phase */}
            {quizState === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto text-center"
              >
                <motion.div
                  className="glass-card p-10 relative overflow-hidden"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                >
                  {/* Confetti effect for good scores */}
                  {score >= questions.length * 0.8 && (
                    <div className="absolute inset-0 pointer-events-none">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            background: ['#00f5ff', '#a855f7', '#ff6b6b', '#f59e0b'][i % 4],
                            left: `${Math.random() * 100}%`,
                          }}
                          initial={{ y: -20, opacity: 1 }}
                          animate={{ y: 500, opacity: 0, rotate: 360 }}
                          transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Score Display */}
                  <motion.div
                    className="w-36 h-36 rounded-full bg-gradient-to-br from-primary via-accent to-coral mx-auto mb-6 flex items-center justify-center relative"
                    animate={{
                      boxShadow: [
                        '0 0 30px rgba(0, 245, 255, 0.4)',
                        '0 0 50px rgba(168, 85, 247, 0.4)',
                        '0 0 30px rgba(0, 245, 255, 0.4)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-32 h-32 rounded-full bg-card flex items-center justify-center">
                      <motion.span
                        className="font-display text-5xl font-bold gradient-text"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.3 }}
                      >
                        {Math.round((score / questions.length) * 100)}%
                      </motion.span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h1 className="font-display text-3xl font-bold mb-2">
                      {getScoreMessage().emoji} {getScoreMessage().text}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                      You answered {score} out of {questions.length} questions correctly in {formatTime(timeElapsed)}
                    </p>
                  </motion.div>

                  {/* Answer Summary */}
                  <motion.div
                    className="flex justify-center gap-2 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {answers.map((correct, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${correct ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                          }`}
                      >
                        {correct ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* AI Feedback */}
                  <motion.div
                    className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-2">AI Feedback</h4>
                        <p className="text-muted-foreground text-sm">
                          {score === questions.length
                            ? "Outstanding! You've mastered this topic. Consider moving to a higher difficulty level or exploring related topics."
                            : score >= questions.length * 0.7
                              ? "Great performance! Review the questions you missed and try again to achieve a perfect score."
                              : "Keep practicing! Focus on understanding the explanations for each question. You're making progress!"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button variant="hero" size="lg" onClick={resetQuiz} className="gap-2">
                      <Sparkles className="w-4 h-4" />
                      New Quiz
                    </Button>
                    <Button variant="glass" size="lg" onClick={() => { setQuizState('playing'); setCurrentQuestion(0); setSelectedAnswer(null); setShowAnswer(false); setScore(0); setAnswers([]); setTimeElapsed(0); }} className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      Retry This Quiz
                    </Button>
                  </motion.div>

                  {isSubmitting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving your progress...
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

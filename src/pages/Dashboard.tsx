import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  Brain,
  Trophy,
  Target,
  TrendingUp,
  Flame,
  Star,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Route,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { progressAPI, Stats } from '@/lib/api';

const quickActions = [
  { icon: Brain, title: 'Take a Quiz', description: 'Test your knowledge', path: '/quiz', color: 'from-cyan-glow to-purple-glow' },
  { icon: MessageSquare, title: 'Chat with AI', description: 'Ask anything', path: '/chat', color: 'from-purple-glow to-accent' },
  { icon: Route, title: 'Learning Path', description: 'Continue journey', path: '/learning-path', color: 'from-coral to-warning' },
  { icon: BookOpen, title: 'Study Notes', description: 'Review materials', path: '/notes', color: 'from-success to-cyan-glow' },
];

const defaultStats: Stats = {
  xp: 0,
  streak: { current: 0, longest: 0 },
  badges: [],
  overallProgress: 0,
  completedSteps: 0,
  totalSteps: 6,
  avgQuizScore: 0,
  lastQuizScore: 0,
  totalQuizzes: 0,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await progressAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Use default stats if API fails
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    { icon: Brain, label: 'Last Quiz Score', value: `${stats.lastQuizScore}%`, color: 'from-cyan-glow to-primary', trend: stats.totalQuizzes > 0 ? `${stats.totalQuizzes} taken` : 'No quizzes yet' },
    { icon: Target, label: 'Overall Progress', value: `${stats.overallProgress}%`, color: 'from-purple-glow to-accent', trend: `${stats.completedSteps}/${stats.totalSteps} steps` },
    { icon: Flame, label: 'Learning Streak', value: `${stats.streak.current} Days`, color: 'from-coral to-warning', trend: stats.streak.current >= 7 ? 'On Fire! 🔥' : `Best: ${stats.streak.longest}` },
    { icon: Trophy, label: 'Total XP', value: stats.xp.toLocaleString(), color: 'from-success to-cyan-glow', trend: `${stats.badges.length} badges` },
  ];

  const recentAchievements = stats.badges.length > 0
    ? stats.badges.slice(-3).map(badge => ({
      icon: Star,
      title: badge.name,
      description: new Date(badge.earnedAt).toLocaleDateString(),
      color: 'bg-warning'
    }))
    : [
      { icon: Star, title: 'Welcome!', description: 'Start learning to earn badges', color: 'bg-primary' }
    ];

  const progressTopics = [
    { topic: 'JavaScript Fundamentals', progress: Math.min(100, stats.overallProgress * 1.5), color: 'bg-cyan-glow' },
    { topic: 'React Basics', progress: Math.max(0, stats.overallProgress - 20), color: 'bg-purple-glow' },
    { topic: 'TypeScript', progress: Math.max(0, stats.overallProgress - 40), color: 'bg-coral' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="gradient-text">{user?.name || 'Learner'}</span>! 👋
            </h1>
            <p className="text-muted-foreground">
              Ready to continue your learning journey? Here's your progress overview.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 hover:bg-white/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-0.5 mb-4`}>
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-foreground" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <span className="font-display text-2xl font-bold">{stat.value}</span>
                  <span className="text-xs text-success">{stat.trend}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Progress & AI Suggestion */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-card p-6"
              >
                <h2 className="font-display text-xl font-semibold mb-6">Current Progress</h2>
                <div className="space-y-4">
                  {progressTopics.map((item) => (
                    <div key={item.topic}>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{item.topic}</span>
                        <span className="text-muted-foreground">{Math.round(item.progress)}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* AI Suggestion */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="gradient-border"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">AI Recommendation</h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {stats.overallProgress < 20
                          ? "Start with JavaScript Fundamentals to build a strong foundation. Master variables, data types, and basic syntax!"
                          : stats.overallProgress < 50
                            ? "Great progress! Focus on React components and hooks to build interactive UIs."
                            : "You're doing amazing! Time to tackle TypeScript for type-safe code!"}
                      </p>
                      <Link to="/learning-path">
                        <Button variant="hero" size="sm" className="group">
                          Start Learning
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <Link key={action.title} to={action.path}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="glass-card p-4 text-center hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} mx-auto mb-3 flex items-center justify-center`}>
                          <action.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-semibold mb-6">Recent Achievements</h2>
                <div className="space-y-4">
                  {recentAchievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-xl ${achievement.color} flex items-center justify-center`}>
                        <achievement.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link to="/achievements" className="block mt-6">
                  <Button variant="ghost" className="w-full">
                    View All Achievements
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Learning Streak Calendar */}
              <div className="glass-card p-6">
                <h2 className="font-display text-xl font-semibold mb-4">This Week</h2>
                <div className="grid grid-cols-7 gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-center">
                      <span className="text-xs text-muted-foreground">{day}</span>
                      <div className={`w-8 h-8 mx-auto mt-2 rounded-lg flex items-center justify-center ${i < stats.streak.current ? 'bg-primary/30 border border-primary/50' : 'bg-white/5'
                        }`}>
                        {i < stats.streak.current && <Flame className="w-4 h-4 text-primary" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import {
  User,
  Mail,
  GraduationCap,
  Trophy,
  Flame,
  Star,
  Target,
  Edit2,
  Camera,
  Loader2,
  Calendar,
  BookOpen,
  Brain,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { progressAPI, Stats } from '@/lib/api';

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
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
    } finally {
      setIsLoading(false);
    }
  };

  const achievements = [
    {
      icon: Trophy,
      title: 'Quiz Master',
      description: 'Complete 10 quizzes',
      progress: Math.min(10, stats?.totalQuizzes || 0),
      total: 10,
      color: 'from-warning to-coral',
      completed: (stats?.totalQuizzes || 0) >= 10
    },
    {
      icon: Flame,
      title: 'Week Warrior',
      description: '7-day learning streak',
      progress: Math.min(7, stats?.streak.current || 0),
      total: 7,
      color: 'from-coral to-warning',
      completed: (stats?.streak.current || 0) >= 7
    },
    {
      icon: Star,
      title: 'Perfect Score',
      description: 'Get 100% on 5 quizzes',
      progress: Math.min(5, Math.floor((stats?.avgQuizScore || 0) / 20)),
      total: 5,
      color: 'from-primary to-purple-glow'
    },
    {
      icon: Target,
      title: 'Topic Master',
      description: 'Complete a learning path',
      progress: stats?.completedSteps || 0,
      total: stats?.totalSteps || 6,
      color: 'from-success to-cyan-glow',
      completed: (stats?.completedSteps || 0) >= (stats?.totalSteps || 6)
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 mb-8 relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl" />

              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                {/* Avatar */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary via-accent to-coral p-1">
                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                      <User className="w-16 h-16 text-muted-foreground" />
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/80 transition-colors shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </motion.button>
                </motion.div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h1 className="font-display text-2xl font-bold">{user?.name || 'Learner'}</h1>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mb-4">
                    <Mail className="w-4 h-4" />
                    {user?.email || 'email@example.com'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary border border-primary/20"
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">{user?.level || 'Beginner'}</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-coral/10 text-coral border border-coral/20"
                    >
                      <Flame className="w-4 h-4" />
                      <span className="text-sm font-medium">{stats?.streak.current || 0} Day Streak</span>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-warning/10 text-warning border border-warning/20"
                    >
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">{stats?.xp || 0} XP</span>
                    </motion.div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <motion.div whileHover={{ y: -5 }} className="cursor-default">
                    <div className="font-display text-3xl font-bold gradient-text">{stats?.totalQuizzes || 0}</div>
                    <div className="text-xs text-muted-foreground">Quizzes</div>
                  </motion.div>
                  <motion.div whileHover={{ y: -5 }} className="cursor-default">
                    <div className="font-display text-3xl font-bold gradient-text">{stats?.badges.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Badges</div>
                  </motion.div>
                  <motion.div whileHover={{ y: -5 }} className="cursor-default">
                    <div className="font-display text-3xl font-bold gradient-text">{stats?.avgQuizScore || 0}%</div>
                    <div className="text-xs text-muted-foreground">Avg Score</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-warning" />
                  Achievements
                </h2>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.title}
                      className="flex items-start gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${achievement.color} p-0.5 flex-shrink-0 ${achievement.completed ? '' : 'opacity-50'
                          }`}
                      >
                        <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                          <achievement.icon className="w-5 h-5" />
                        </div>
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{achievement.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {achievement.progress}/{achievement.total}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${achievement.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Learning Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Learning Stats
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Overall Progress</p>
                      <p className="font-display text-2xl font-bold">{stats?.overallProgress || 0}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Steps</p>
                      <p className="text-sm font-medium">{stats?.completedSteps || 0}/{stats?.totalSteps || 6}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                    <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                      <Flame className="w-6 h-6 text-warning" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Best Streak</p>
                      <p className="font-display text-2xl font-bold">{stats?.streak.longest || 0} days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Current</p>
                      <p className="text-sm font-medium text-success">{stats?.streak.current || 0} days</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                    <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Last Quiz Score</p>
                      <p className="font-display text-2xl font-bold">{stats?.lastQuizScore || 0}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Average</p>
                      <p className="text-sm font-medium">{stats?.avgQuizScore || 0}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Learning Calendar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6 md:col-span-2"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    This Week's Activity
                  </h2>
                </div>
                <div className="grid grid-cols-7 gap-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const isActive = i < (stats?.streak.current || 0);
                    return (
                      <motion.div
                        key={day}
                        className="text-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                      >
                        <span className="text-xs text-muted-foreground block mb-2">{day}</span>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all ${isActive
                              ? 'bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/50'
                              : 'bg-white/5 border border-white/10'
                            }`}
                        >
                          {isActive && <Flame className="w-5 h-5 text-primary" />}
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import {
  Route,
  CheckCircle2,
  Circle,
  Lock,
  ChevronRight,
  Sparkles,
  Clock,
  Star,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const learningSteps = [
  {
    id: 1,
    title: 'JavaScript Fundamentals',
    description: 'Variables, data types, operators, and control flow',
    duration: '2 hours',
    status: 'completed',
    progress: 100,
    lessons: 8,
    xp: 150,
  },
  {
    id: 2,
    title: 'Functions & Scope',
    description: 'Function declarations, arrow functions, closures',
    duration: '1.5 hours',
    status: 'completed',
    progress: 100,
    lessons: 6,
    xp: 120,
  },
  {
    id: 3,
    title: 'Arrays & Objects',
    description: 'Array methods, object manipulation, destructuring',
    duration: '2 hours',
    status: 'current',
    progress: 60,
    lessons: 10,
    xp: 200,
  },
  {
    id: 4,
    title: 'Async JavaScript',
    description: 'Promises, async/await, error handling',
    duration: '2.5 hours',
    status: 'locked',
    progress: 0,
    lessons: 8,
    xp: 180,
  },
  {
    id: 5,
    title: 'DOM Manipulation',
    description: 'Selecting elements, events, dynamic content',
    duration: '2 hours',
    status: 'locked',
    progress: 0,
    lessons: 7,
    xp: 160,
  },
  {
    id: 6,
    title: 'React Basics',
    description: 'Components, props, state, and hooks',
    duration: '3 hours',
    status: 'locked',
    progress: 0,
    lessons: 12,
    xp: 250,
  },
];

function StepCard({ step, index }: { step: typeof learningSteps[0]; index: number }) {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-white" />;
      case 'current':
        return <Circle className="w-5 h-5 text-white" />;
      default:
        return <Lock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBg = () => {
    switch (step.status) {
      case 'completed':
        return 'bg-success';
      case 'current':
        return 'bg-primary';
      default:
        return 'bg-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Connection line to next card */}
      {index < learningSteps.length - 1 && (
        <div className="absolute left-6 top-full w-0.5 h-4 bg-gradient-to-b from-white/20 to-transparent z-0" />
      )}

      <div
        className={`glass-card overflow-hidden transition-all hover:scale-[1.01] ${step.status === 'current' ? 'border-2 border-primary ring-2 ring-primary/20' :
            step.status === 'locked' ? 'opacity-60' : 'border border-white/10'
          }`}
      >
        {/* Progress bar at top for current step */}
        {step.status === 'current' && (
          <div className="h-1 bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${step.progress}%` }}
              className="h-full bg-gradient-to-r from-primary to-accent"
            />
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Header with step number and status */}
          <div className="flex items-start gap-4">
            {/* Status Icon */}
            <div className={`w-12 h-12 rounded-xl ${getStatusBg()} flex items-center justify-center flex-shrink-0 ${step.status === 'current' ? 'animate-pulse' : ''
              }`}>
              {getStatusIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Step label and badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Step {step.id}
                </span>
                {step.status === 'current' && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    In Progress
                  </span>
                )}
                {step.status === 'completed' && (
                  <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium">
                    Completed
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-display text-lg sm:text-xl font-semibold mb-1.5">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm mb-4">
                {step.description}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {step.duration}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  {step.lessons} lessons
                </span>
                <span className="flex items-center gap-1.5 text-warning">
                  <Star className="w-4 h-4" />
                  {step.xp} XP
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                {step.status === 'current' && (
                  <>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Progress: </span>
                      <span className="text-primary font-semibold">{step.progress}%</span>
                    </div>
                    <Button variant="hero" size="sm" className="group">
                      Continue
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </>
                )}
                {step.status === 'completed' && (
                  <>
                    <div className="flex items-center gap-1.5 text-success text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>+{step.xp} XP earned</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Review
                    </Button>
                  </>
                )}
                {step.status === 'locked' && (
                  <span className="text-sm text-muted-foreground">
                    🔒 Complete previous step to unlock
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LearningPath() {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navbar />

      <main className="pt-24 pb-12 relative z-10">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral to-warning mx-auto mb-6 flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Route className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Your <span className="gradient-text-coral">Learning Path</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Follow this personalized roadmap to master web development
            </p>
          </motion.div>

          {/* Progress Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-10 max-w-3xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Overall Progress</p>
                <h3 className="font-display text-2xl font-bold">3 of 6 Steps Complete</h3>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-primary">470</p>
                  <p className="text-xs text-muted-foreground">XP Earned</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-2xl font-bold text-coral">50%</p>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
            </div>
            <div className="mt-4 h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-coral to-warning rounded-full"
              />
            </div>
          </motion.div>

          {/* Learning Steps */}
          <div className="max-w-3xl mx-auto space-y-4">
            {learningSteps.map((step, index) => (
              <StepCard key={step.id} step={step} index={index} />
            ))}
          </div>

          {/* AI Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-3xl mx-auto mt-10"
          >
            <div className="glass-card p-6 border-l-4 border-primary">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AI Learning Tip</h3>
                  <p className="text-muted-foreground text-sm">
                    You're making great progress with Arrays & Objects! Focus on mastering the{' '}
                    <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">map</code>,{' '}
                    <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">filter</code>, and{' '}
                    <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded">reduce</code> methods - they're essential for React!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import {
  Brain,
  MessageSquare,
  Route,
  Trophy,
  BookOpen,
  Upload,
  BarChart3,
  Bell,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Quizzes',
    description: 'Interactive MCQ quizzes with AI-generated feedback and detailed analysis of your performance.',
    color: 'from-cyan-glow to-primary',
    glow: '#00f5ff',
  },
  {
    icon: MessageSquare,
    title: 'AI Tutor Chat',
    description: 'Get instant answers to your questions with our intelligent AI tutor available 24/7.',
    color: 'from-purple-glow to-accent',
    glow: '#a855f7',
  },
  {
    icon: Route,
    title: 'Learning Path',
    description: 'Follow a personalized roadmap with AI-recommended topics tailored to your goals.',
    color: 'from-coral to-warning',
    glow: '#ff6b6b',
  },
  {
    icon: Trophy,
    title: 'Achievements & Badges',
    description: 'Unlock badges, track streaks, and celebrate milestones as you progress.',
    color: 'from-success to-cyan-glow',
    glow: '#10b981',
  },
  {
    icon: BookOpen,
    title: 'Smart Notes',
    description: 'AI-generated notes after each quiz with easy-to-understand explanations.',
    color: 'from-primary to-purple-glow',
    glow: '#00f5ff',
  },
  {
    icon: Upload,
    title: 'Book Upload',
    description: 'Upload your books or PDFs and get AI-powered chapter-wise explanations.',
    color: 'from-warning to-coral',
    glow: '#f59e0b',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Visualize your progress with detailed charts showing strengths and areas to improve.',
    color: 'from-accent to-primary',
    glow: '#a855f7',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Stay on track with achievement alerts, learning reminders, and quiz updates.',
    color: 'from-cyan-glow to-success',
    glow: '#00f5ff',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      style={{ perspective: 1000 }}
      className="group"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative h-full"
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
          style={{ background: `linear-gradient(135deg, ${feature.glow}40, transparent)` }}
        />

        <div className="glass-card p-6 h-full relative overflow-hidden transition-all duration-500 hover:border-white/20">
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity">
            <feature.icon className="w-full h-full" />
          </div>

          {/* Animated particles on hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{ background: feature.glow }}
                  initial={{
                    x: Math.random() * 100 + '%',
                    y: '100%',
                    opacity: 0
                  }}
                  animate={{
                    y: '-100%',
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* Icon with animated gradient border */}
          <motion.div
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-0.5 mb-5 relative`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center relative z-10">
              <feature.icon className="w-6 h-6 text-foreground" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ background: `linear-gradient(135deg, ${feature.glow}, transparent)` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>

          {/* Content */}
          <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors relative z-10">
            {feature.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed relative z-10">
            {feature.description}
          </p>

          {/* Learn more link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            className="mt-4 flex items-center gap-2 text-primary text-sm font-medium"
          >
            <span>Learn more</span>
            <motion.span
              animate={isHovered ? { x: [0, 5, 0] } : { x: 0 }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          y: [0, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-coral/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Powerful Features
            </span>
          </motion.div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
            Everything You Need to{' '}
            <span className="relative inline-block">
              <span className="gradient-text">Learn Better</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-coral rounded-full"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            Powerful AI-driven features designed to make your learning journey
            more effective, engaging, and personalized.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

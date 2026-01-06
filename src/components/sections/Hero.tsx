import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Zap, BookOpen, Star, Rocket, GraduationCap, TrendingUp, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingOrbs } from '@/components/3d/FloatingOrbs';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const features = [
  { icon: Brain, text: 'AI-Powered Learning' },
  { icon: Zap, text: 'Instant Feedback' },
  { icon: BookOpen, text: 'Personalized Path' },
];

const stats = [
  { value: '50K+', label: 'Active Learners' },
  { value: '1M+', label: 'Lessons Completed' },
  { value: '98%', label: 'Success Rate' },
];

// Floating animated elements component
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient blobs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/4 w-80 h-80 bg-coral/15 rounded-full blur-3xl"
      />

      {/* Floating icons */}
      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 left-[10%] hidden lg:block"
      >
        <div className="p-4 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20">
          <Brain className="w-8 h-8 text-primary" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-48 right-[15%] hidden lg:block"
      >
        <div className="p-4 rounded-2xl bg-accent/10 backdrop-blur-sm border border-accent/20">
          <Rocket className="w-8 h-8 text-accent" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [-15, 25, -15], rotate: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-[20%] hidden lg:block"
      >
        <div className="p-4 rounded-2xl bg-success/10 backdrop-blur-sm border border-success/20">
          <Star className="w-8 h-8 text-success" />
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [25, -25, 25], rotate: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-48 right-[10%] hidden lg:block"
      >
        <div className="p-4 rounded-2xl bg-warning/10 backdrop-blur-sm border border-warning/20">
          <GraduationCap className="w-8 h-8 text-warning" />
        </div>
      </motion.div>

      {/* Animated lines */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <motion.path
          d="M0,400 Q400,200 800,400 T1600,400"
          stroke="url(#gradient1)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f5ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00f5ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Animated text with gradient
function AnimatedTitle() {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-6"
    >
      <span className="block">Learn Smarter</span>
      <span className="block mt-2">
        with{' '}
        <span className="relative inline-block">
          <span className="gradient-text text-glow animate-pulse-slow">AI Tutor</span>
          <motion.span
            className="absolute -inset-1 rounded-lg opacity-30 blur-lg bg-gradient-to-r from-primary via-accent to-coral"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </span>
      </span>
    </motion.h1>
  );
}

// Animated counter component
function AnimatedCounter({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all cursor-default"
    >
      <motion.p
        className="font-display text-3xl md:text-4xl font-bold gradient-text"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.5 }}
      >
        {value}
      </motion.p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* 3D Background */}
      <FloatingOrbs />

      {/* Floating Elements */}
      <FloatingElements />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Radial Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, hsl(222 47% 6%) 70%)'
        }}
      />

      <motion.div style={{ y, opacity }} className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-8 group hover:border-primary/50 transition-all cursor-default"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI-Powered Learning Platform
            </span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary"
            >
              →
            </motion.span>
          </motion.div>

          {/* Main Heading with Animation */}
          <AnimatedTitle />

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Experience personalized learning with{' '}
            <span className="text-primary font-medium">AI-generated quizzes</span>,{' '}
            <span className="text-accent font-medium">instant feedback</span>, and a{' '}
            <span className="text-warning font-medium">tailored learning path</span>{' '}
            designed just for you.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/signup">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="hero" size="xl" className="group text-lg px-8 py-6 h-auto">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Learning Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link to="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="hero-outline" size="xl" className="text-lg px-8 py-6 h-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:border-primary/30 transition-all cursor-default backdrop-blur-sm"
              >
                <feature.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <AnimatedCounter value={stat.value} label={stat.label} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1"
            >
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 rounded-full bg-primary"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

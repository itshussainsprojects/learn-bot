import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ArrowRight, Sparkles, Rocket, CheckCircle, Zap, Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const benefits = [
  "Personalized AI learning path",
  "24/7 AI tutor assistance",
  "Track progress & earn badges",
  "100% free to start"
];

const testimonials = [
  { name: "Sarah K.", role: "Student", text: "Improved my grades by 40%!", avatar: "S" },
  { name: "Mike R.", role: "Developer", text: "Best learning platform ever!", avatar: "M" },
  { name: "Lisa T.", role: "Designer", text: "Love the AI tutor feature!", avatar: "L" },
];

export function CTA() {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  return (
    <section ref={containerRef} className="py-32 relative overflow-hidden">
      {/* Animated orbs background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-coral/10 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          style={{ scale }}
          className="max-w-5xl mx-auto"
        >
          {/* Main Card with unique 3D effect */}
          <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative"
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Glow effect behind card */}
            <motion.div
              className="absolute -inset-4 rounded-3xl opacity-50 blur-2xl"
              animate={{
                background: isHovered
                  ? 'linear-gradient(135deg, rgba(0, 245, 255, 0.4), rgba(168, 85, 247, 0.4))'
                  : 'linear-gradient(135deg, rgba(0, 245, 255, 0.2), rgba(168, 85, 247, 0.2))'
              }}
            />

            <div className="glass-card p-8 md:p-12 lg:p-16 rounded-3xl relative overflow-hidden border border-white/10">
              {/* Inner animated gradient */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    'radial-gradient(circle at 0% 0%, rgba(0, 245, 255, 0.2), transparent 50%)',
                    'radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.2), transparent 50%)',
                    'radial-gradient(circle at 100% 100%, rgba(255, 107, 107, 0.2), transparent 50%)',
                    'radial-gradient(circle at 0% 100%, rgba(245, 158, 11, 0.2), transparent 50%)',
                    'radial-gradient(circle at 0% 0%, rgba(0, 245, 255, 0.2), transparent 50%)',
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />

              {/* Floating particles inside card */}
              {isHovered && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-primary"
                      style={{ left: `${Math.random() * 100}%` }}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '-100%', opacity: [0, 1, 0] }}
                      transition={{
                        duration: 2 + Math.random() * 2,
                        delay: Math.random() * 0.5,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="relative z-10 text-center">
                {/* Icon with pulsing ring */}
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary via-accent to-coral mb-8 relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Rocket className="w-10 h-10 text-white" />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-accent"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </motion.div>

                {/* Heading */}
                <motion.h2
                  className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                >
                  Ready to Transform Your{' '}
                  <span className="relative inline-block">
                    <span className="gradient-text">Learning Journey?</span>
                  </span>
                </motion.h2>

                {/* Description */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                  Join thousands of students who are already learning smarter with AI.
                  Start your personalized learning path today!
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                  <Link to="/signup">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="hero" size="xl" className="group text-lg px-8 py-6 h-auto relative overflow-hidden">
                        <Zap className="w-5 h-5 mr-2" />
                        Get Started Now - It's Free
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/chat">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button variant="glass" size="xl" className="text-lg px-8 py-6 h-auto">
                        <Play className="w-5 h-5 mr-2" />
                        Try AI Tutor First
                      </Button>
                    </motion.div>
                  </Link>
                </div>

                {/* Social proof avatars */}
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center -space-x-3">
                    {testimonials.map((t, i) => (
                      <motion.div
                        key={t.name}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center border-2 border-background text-sm font-bold"
                      >
                        {t.avatar}
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 }}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border-2 border-background text-xs font-bold"
                    >
                      +5K
                    </motion.div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ✨ Join <span className="text-primary font-semibold">5,000+</span> learners already using LearnBotX
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

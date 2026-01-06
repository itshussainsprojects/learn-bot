import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, BookOpen, Award, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Users, value: '50K+', label: 'Active Learners', color: 'text-cyan-glow' },
  { icon: BookOpen, value: '1M+', label: 'Quizzes Completed', color: 'text-purple-glow' },
  { icon: Award, value: '100K+', label: 'Badges Earned', color: 'text-coral' },
  { icon: TrendingUp, value: '95%', label: 'Success Rate', color: 'text-success' },
];

export function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 relative">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, hsl(222 47% 8% / 0.5) 50%, transparent 100%)'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-4">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="font-display text-3xl md:text-4xl font-bold mb-2 gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

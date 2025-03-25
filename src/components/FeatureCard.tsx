
import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className,
  delay = 0,
}) => {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [controls]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: delay * 0.1,
        ease: "easeOut" 
      } 
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative glass p-6 rounded-xl border border-white/10 dark:border-white/5 transition-all duration-300 hover:shadow-lg mythical-border",
        className
      )}
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rune-pattern"></div>
      
      <div className="relative mb-4 p-3 rounded-lg bg-primary/10 w-fit">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      
      <h3 className="text-xl font-mythical mb-2 relative">{title}</h3>
      
      <p className="text-muted-foreground relative">{description}</p>
      
      {/* Mythological decorative element */}
      <div className="absolute -bottom-2 -right-2 w-10 h-10 opacity-20 rotate-12 text-primary/50 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path d="M12 18l-6-6 6-6 6 6-6 6z"></path>
          <path d="M12 14v4"></path>
          <path d="M12 6v4"></path>
          <path d="M16 12h-4"></path>
          <path d="M8 12h4"></path>
        </svg>
      </div>
    </motion.div>
  );
};

export default FeatureCard;

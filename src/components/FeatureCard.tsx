
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
        "group relative glass p-6 rounded-xl border border-white/10 transition-all duration-300 hover:shadow-lg",
        className
      )}
      variants={variants}
      initial="hidden"
      animate={controls}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative mb-4 p-3 rounded-lg bg-primary/10 w-fit">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2 relative">{title}</h3>
      
      <p className="text-muted-foreground relative">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;

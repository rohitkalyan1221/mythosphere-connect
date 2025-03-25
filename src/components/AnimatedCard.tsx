
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  title: string;
  imageSrc?: string;
  description: string;
  className?: string;
  index?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  title,
  imageSrc,
  description,
  className,
  index = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    const rotateX = 10 * (0.5 - y);
    const rotateY = -10 * (0.5 - x);
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "glass overflow-hidden rounded-xl border border-white/10 transition-all duration-300 ease-out",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.5,
          delay: index * 0.1 
        }
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 animate-pulse"></div>
            </div>
          </div>
        )}
        
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card/80 to-transparent"></div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

export default AnimatedCard;

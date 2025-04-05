
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const orbitRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!orbitRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as a percentage from center
      const x = (clientX - innerWidth / 2) / (innerWidth / 2) * 10;
      const y = (clientY - innerHeight / 2) / (innerHeight / 2) * 10;
      
      orbitRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleStartCreating = () => {
    navigate('/stories');
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-20 pb-12">
      {/* Background gradient circles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-primary/10 animate-float blur-3xl opacity-60"></div>
        <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-accent/10 animate-float animation-delay-200 blur-3xl opacity-60"></div>
      </div>
      
      {/* Orbiting elements */}
      <div ref={orbitRef} className="absolute inset-0 z-0 transition-transform duration-200 ease-out">
        <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full glass animate-float"></div>
        <div className="absolute top-3/4 left-1/3 w-12 h-12 rounded-full glass animate-float animation-delay-200"></div>
        <div className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full glass animate-float animation-delay-300"></div>
        <div className="absolute bottom-1/4 right-1/3 w-16 h-16 rounded-full glass animate-float animation-delay-400"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full glass inline-block">
              Discover the World of Myths
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-balance"
          >
            Bring Ancient Stories to Life with AI-Powered Mythology
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl text-balance"
          >
            Create, explore, and share mythological worlds with our AI-powered platform. 
            Connect with a community of storytellers and bring ancient narratives to modern light.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              onClick={handleStartCreating}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              Start Creating
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

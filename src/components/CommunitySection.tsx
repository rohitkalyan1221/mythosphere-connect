
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, MessageSquare, BookOpen, Sparkles } from 'lucide-react';
import FeatureCard from './FeatureCard';

const CommunitySection: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Collaborative Worldbuilding",
      description: "Work together with writers and artists to create rich mythological worlds with our AI-powered tools."
    },
    {
      icon: MessageSquare,
      title: "Community Discussions",
      description: "Engage in meaningful conversations about ancient stories and their modern interpretations."
    },
    {
      icon: BookOpen,
      title: "Shared Libraries",
      description: "Access and contribute to a growing collection of mythological narratives and visuals."
    },
    {
      icon: Sparkles,
      title: "AI-Enhanced Creation",
      description: "Leverage cutting-edge AI to generate authentic mythological content with cultural sensitivity."
    }
  ];

  return (
    <section id="community" className="py-24 relative bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 blur-xl opacity-70"></div>
              <div className="relative glass rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-square md:aspect-[4/3] bg-black/5 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full glass flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 animate-pulse flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-primary/30"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <p className="text-sm text-muted-foreground font-medium">Community Hub Preview</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="lg:w-1/2">
            <motion.span 
              className="px-4 py-1.5 text-xs font-semibold tracking-wide uppercase rounded-full glass inline-block mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              Community Hub
            </motion.span>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Connect with Fellow Mythology Enthusiasts
            </motion.h2>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Join our thriving community of storytellers, artists, researchers, and mythology lovers. 
              Share your creations, collaborate on projects, and explore ancient narratives together.
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index}
                />
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button size="lg" className="rounded-full px-6 group">
                Join the Community
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;

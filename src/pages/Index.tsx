
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import ExplorerSection from '../components/ExplorerSection';
import CommunitySection from '../components/CommunitySection';
import Footer from '../components/Footer';
import { Sparkles, Brain, Palette, Globe } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const Index: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start('visible');
  }, [controls]);

  const features = [
    {
      icon: Sparkles,
      title: "AI Mythology Creation",
      description: "Generate detailed mythological narratives with cultural accuracy using our advanced AI storytelling engine."
    },
    {
      icon: Brain,
      title: "Intelligent World Building",
      description: "Create coherent mythological worlds with procedurally generated maps and civilizations."
    },
    {
      icon: Palette,
      title: "Visualization Engine",
      description: "Bring your mythological characters to life with our multi-model image generation pipeline."
    },
    {
      icon: Globe,
      title: "Cultural Exploration",
      description: "Discover and learn about diverse mythological traditions from around the world."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main>
        <HeroSection />
        
        <section id="features" className="py-24 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-3xl md:text-4xl font-semibold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                Key Features
              </motion.h2>
              
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Our platform combines cutting-edge AI technology with mythological expertise to create
                an immersive storytelling experience
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  delay={index}
                />
              ))}
            </div>
          </div>
        </section>
        
        <ExplorerSection />
        <CommunitySection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

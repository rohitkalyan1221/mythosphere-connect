
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import StoryGenerator from '../components/StoryGenerator';
import { Scroll, BookOpen, Feather } from 'lucide-react';

const StoryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-primary/5 animate-float blur-3xl opacity-60"></div>
        <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-accent/5 animate-float animation-delay-200 blur-3xl opacity-60"></div>
        <div className="absolute inset-0 rune-pattern opacity-5"></div>
      </div>
      
      <NavBar />
      
      <main className="flex-grow pt-28 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-4xl md:text-5xl font-mythical bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Mythological Tales
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Unleash the power of AI to craft authentic mythological stories from cultures around the world.
              Explore ancient narratives or create your own legendary tales.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StoryGenerator />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 text-center"
          >
            <div className="inline-flex items-center space-x-2 mb-4">
              <Feather className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-mythical">Writing Tips</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
              <div className="glass p-6 rounded-xl mythical-border">
                <h3 className="text-lg font-semibold mb-2">Cultural Accuracy</h3>
                <p className="text-muted-foreground">Specify a particular mythology to ensure the story incorporates authentic cultural elements and deities.</p>
              </div>
              
              <div className="glass p-6 rounded-xl mythical-border">
                <h3 className="text-lg font-semibold mb-2">Character Focus</h3>
                <p className="text-muted-foreground">For a more personal narrative, include a specific mythological character as the protagonist or antagonist.</p>
              </div>
              
              <div className="glass p-6 rounded-xl mythical-border">
                <h3 className="text-lg font-semibold mb-2">Thematic Elements</h3>
                <p className="text-muted-foreground">Choose a theme that resonates with traditional mythological motifs like heroism, transformation, or divine intervention.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoryPage;

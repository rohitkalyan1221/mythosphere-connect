
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import StoryGenerator from '../components/story-generator/StoryGenerator';
import { Scroll, BookOpen, Feather, Sparkles, Lightbulb, Compass, Users, MessageSquare, Volume2 } from 'lucide-react';

const StoryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-[300px] -left-[300px] w-[600px] h-[600px] rounded-full bg-primary/5 animate-float blur-3xl opacity-60"></div>
        <div className="absolute -bottom-[200px] -right-[200px] w-[500px] h-[500px] rounded-full bg-accent/5 animate-float animation-delay-200 blur-3xl opacity-60"></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] rounded-full bg-secondary/5 animate-float animation-delay-300 blur-3xl opacity-40"></div>
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
              <div className="relative">
                <BookOpen className="h-8 w-8 text-primary mr-2" />
                <Sparkles className="h-4 w-4 text-accent absolute -top-1 -right-1 animate-pulse" />
              </div>
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
            className="mt-20"
          >
            <div className="flex items-center justify-center space-x-2 mb-8">
              <Lightbulb className="h-5 w-5 text-primary" />
              <h2 className="text-3xl font-mythical">Features & Inspiration</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="glass p-6 rounded-xl mythical-border hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
                <div className="flex items-center mb-3 text-primary">
                  <Feather className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-semibold">Authentic Mythology</h3>
                </div>
                <p className="text-muted-foreground">Explore pantheons of gods, sacred locations, and cultural rituals to create rich mythological narratives from various world cultures.</p>
              </div>
              
              <div className="glass p-6 rounded-xl mythical-border hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
                <div className="flex items-center mb-3 text-primary">
                  <Compass className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-semibold">Quest Generation</h3>
                </div>
                <p className="text-muted-foreground">AI suggests unique quests with objectives, obstacles, and narrative twists that complement your mythological setting.</p>
              </div>
              
              <div className="glass p-6 rounded-xl mythical-border hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
                <div className="flex items-center mb-3 text-primary">
                  <Sparkles className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-semibold">Scene Visualization</h3>
                </div>
                <p className="text-muted-foreground">Illustrate key moments from your tales with AI-generated imagery that captures the essence of your mythological narrative.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-6">
              <div className="glass p-6 rounded-xl mythical-border hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
                <div className="flex items-center mb-3 text-primary">
                  <Scroll className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-semibold">Lore Expansion</h3>
                </div>
                <p className="text-muted-foreground">AI fills in historical events, myths, and world-building details to create a rich and immersive mythological universe.</p>
              </div>
              
              <div className="glass p-6 rounded-xl mythical-border hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
                <div className="flex items-center mb-3 text-primary">
                  <Users className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-semibold">NPC Backstories</h3>
                </div>
                <p className="text-muted-foreground">Generate deep, interconnected character backgrounds with realistic motivations that enhance your mythological narratives.</p>
              </div>
              
              <div className="glass p-6 rounded-xl mythical-border hover:shadow-lg transition-shadow duration-300 hover:-translate-y-1 transform transition-transform">
                <div className="flex items-center mb-3 text-primary">
                  <Volume2 className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-semibold">Voice Narration</h3>
                </div>
                <p className="text-muted-foreground">Bring your stories to life with multiple voice options including female and male narrators for an immersive audio experience.</p>
              </div>
            </div>

            <div className="mt-12 p-6 glass rounded-xl mythical-border max-w-4xl mx-auto">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold">Creative Tips</h3>
              </div>
              
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Use the quest generator to add adventure elements to your mythology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Combine character backstories with dialogue to create compelling NPCs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Expand the lore of your story to create a rich and detailed world</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Listen to your stories with different voice narrators for different characters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Share your stories and quests to inspire others with mythological adventures</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StoryPage;

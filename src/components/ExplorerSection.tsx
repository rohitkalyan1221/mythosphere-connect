
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from './AnimatedCard';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ExplorerSection: React.FC = () => {
  const mythologies = [
    {
      title: "Greek Pantheon",
      description: "Explore the realm of Zeus, Poseidon, and the gods of Olympus"
    },
    {
      title: "Norse Legends",
      description: "Discover the tales of Thor, Odin, and the nine realms"
    },
    {
      title: "Egyptian Mythology",
      description: "Uncover the mysteries of Ra, Isis, and ancient Egyptian deities"
    },
    {
      title: "Celtic Folklore",
      description: "Wander through the mystical tales of Celtic heroes and spirits"
    },
    {
      title: "Japanese Mythology",
      description: "Experience the rich traditions of Shinto gods and yokai"
    },
    {
      title: "Mayan Mythology",
      description: "Journey through the sacred stories of Mesoamerican culture"
    }
  ];

  return (
    <section id="explore" className="py-24 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-secondary/50 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            Explore Mythologies
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover ancient stories from cultures around the world, powered by our AI storytelling engine
          </motion.p>
          
          <motion.div 
            className="max-w-md mx-auto mt-8 flex rounded-full glass p-1 pr-1.5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Search className="h-5 w-5 text-muted-foreground ml-3 mr-2 flex-shrink-0 self-center" />
            <Input 
              type="text" 
              placeholder="Search mythology or deity..." 
              className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground" 
            />
            <Button size="sm" className="rounded-full">
              Search
            </Button>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mythologies.map((myth, index) => (
            <AnimatedCard
              key={myth.title}
              title={myth.title}
              description={myth.description}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="ghost" className="group">
            View All Mythologies
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExplorerSection;

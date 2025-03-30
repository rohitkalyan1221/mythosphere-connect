
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from './AnimatedCard';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';

const ExplorerSection: React.FC = () => {
  const navigate = useNavigate();
  
  const mythologies = [
    {
      title: "Greek Pantheon",
      description: "Explore the realm of Zeus, Poseidon, and the gods of Olympus",
      image: "https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
    },
    {
      title: "Norse Legends",
      description: "Discover the tales of Thor, Odin, and the nine realms",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
    },
    {
      title: "Egyptian Mythology",
      description: "Uncover the mysteries of Ra, Isis, and ancient Egyptian deities",
      image: "https://images.unsplash.com/photo-1608328061409-d03f132d97b5?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
    },
    {
      title: "Celtic Folklore",
      description: "Wander through the mystical tales of Celtic heroes and spirits",
      image: "https://images.unsplash.com/photo-1529161518598-9c2a4e8a056a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
    },
    {
      title: "Japanese Mythology",
      description: "Experience the rich traditions of Shinto gods and yokai",
      image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
    },
    {
      title: "Mayan Mythology",
      description: "Journey through the sacred stories of Mesoamerican culture",
      image: "https://images.unsplash.com/photo-1531219572328-a0171b4448a3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3"
    }
  ];

  const handleViewAll = () => {
    navigate('/stories');
  };

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
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mythologies.map((myth, index) => (
            <AnimatedCard
              key={myth.title}
              title={myth.title}
              description={myth.description}
              imageSrc={myth.image}
              index={index}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="ghost" className="group" onClick={handleViewAll}>
            View All Mythologies
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExplorerSection;

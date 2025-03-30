
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from './AnimatedCard';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ExplorerSection: React.FC = () => {
  const mythologies = [
    {
      title: "Greek Pantheon",
      description: "Explore the realm of Zeus, Poseidon, and the gods of Olympus",
      image: "/assets/communities/greek-mythology.jpg"
    },
    {
      title: "Norse Legends",
      description: "Discover the tales of Thor, Odin, and the nine realms",
      image: "/assets/communities/norse-mythology.jpg"
    },
    {
      title: "Egyptian Mythology",
      description: "Uncover the mysteries of Ra, Isis, and ancient Egyptian deities",
      image: "/assets/communities/egyptian-mythology.jpg"
    },
    {
      title: "Celtic Folklore",
      description: "Wander through the mystical tales of Celtic heroes and spirits",
      image: "/assets/communities/celtic-mythology.jpg"
    },
    {
      title: "Japanese Mythology",
      description: "Experience the rich traditions of Shinto gods and yokai",
      image: "/assets/communities/japanese-mythology.jpg"
    },
    {
      title: "Mayan Mythology",
      description: "Journey through the sacred stories of Mesoamerican culture",
      image: "/assets/communities/mayan-mythology.jpg"
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
          <Link to="/stories">
            <Button variant="ghost" className="group">
              View All Mythologies
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExplorerSection;

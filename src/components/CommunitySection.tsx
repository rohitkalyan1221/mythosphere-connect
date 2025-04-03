
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, MessageSquare, BookOpen, Sparkles, MapPin, Compass, Star, Share2, ChevronRight } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const CommunitySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'featured' | 'popular' | 'new'>('featured');
  
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

  const communityHubs = {
    featured: [
      {
        id: 1,
        name: "Norse Mythology Explorers",
        description: "Dedicated to exploring the rich tapestry of Norse mythology, from Odin to Ragnarok.",
        members: 4251,
        active: 236,
        tags: ["Norse", "Vikings", "Asgard"],
        image: "/assets/communities/norse.jpg"
      },
      {
        id: 2,
        name: "Greek Pantheon Society",
        description: "Discussing the gods, heroes, and monsters of ancient Greek mythology.",
        members: 3871,
        active: 189,
        tags: ["Greek", "Olympus", "Heroes"],
        image: "/assets/communities/greek.jpg"
      },
      {
        id: 3,
        name: "Egyptian Mythos",
        description: "Deciphering the mysteries of ancient Egyptian deities and afterlife beliefs.",
        members: 2985,
        active: 122,
        tags: ["Egyptian", "Pharaohs", "Anubis"],
        image: "/assets/communities/egyptian.jpg"
      },
      {
        id: 4,
        name: "Celtic Legends",
        description: "Preserving and discussing the folklore and mythic tales of Celtic traditions.",
        members: 1856,
        active: 78,
        tags: ["Celtic", "Druids", "Folklore"],
        image: "/assets/communities/celtic.jpg"
      }
    ],
    popular: [
      {
        id: 5,
        name: "Japanese Folklore Hub",
        description: "Exploring yokai, kami, and other elements of Japanese folklore and mythology.",
        members: 3102,
        active: 156,
        tags: ["Japanese", "Yokai", "Kami"],
        image: "/assets/communities/japanese.jpg"
      },
      {
        id: 6,
        name: "Hindu Mythology Council",
        description: "Dedicated to the vast pantheon and epic stories of Hindu mythology.",
        members: 2783,
        active: 173,
        tags: ["Hindu", "Vedic", "Epics"],
        image: "/assets/communities/hindu.jpg"
      },
      {
        id: 2,
        name: "Greek Pantheon Society",
        description: "Discussing the gods, heroes, and monsters of ancient Greek mythology.",
        members: 3871,
        active: 189,
        tags: ["Greek", "Olympus", "Heroes"],
        image: "/assets/communities/greek.jpg"
      },
      {
        id: 7,
        name: "Mesoamerican Myths",
        description: "Exploring Aztec, Maya, and other Mesoamerican mythological traditions.",
        members: 1459,
        active: 62,
        tags: ["Aztec", "Maya", "Inca"],
        image: "/assets/communities/mesoamerican.jpg"
      }
    ],
    new: [
      {
        id: 8,
        name: "Slavic Folklore Collective",
        description: "Recently formed group dedicated to Slavic gods, creatures, and traditions.",
        members: 784,
        active: 101,
        tags: ["Slavic", "Eastern Europe", "Baba Yaga"],
        image: "/assets/communities/slavic.jpg"
      },
      {
        id: 9,
        name: "Pacific Island Legends",
        description: "New community for sharing and preserving myths from Pacific Island cultures.",
        members: 412,
        active: 57,
        tags: ["Polynesian", "Oceania", "Oral Traditions"],
        image: "/assets/communities/pacific.jpg"
      },
      {
        id: 10,
        name: "African Myth Tapestry",
        description: "Celebrating the diverse mythological traditions across the African continent.",
        members: 621,
        active: 84,
        tags: ["African", "Folklore", "Oral History"],
        image: "/assets/communities/african.jpg"
      },
      {
        id: 11,
        name: "Indigenous American Stories",
        description: "Respectfully discussing and preserving Native American mythological traditions.",
        members: 539,
        active: 63,
        tags: ["Native American", "First Nations", "Tribal"],
        image: "/assets/communities/indigenous.jpg"
      }
    ]
  };

  const displayedHubs = communityHubs[activeTab];

  return (
    <section id="community" className="py-24 relative bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          <motion.div 
            className="lg:w-1/3 sticky top-24"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
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
              className="grid grid-cols-1 gap-4 mb-8"
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
                  className="glass"
                />
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {/* Changed to Link component with to="/community" */}
              <Link to="/community">
                <Button size="lg" className="rounded-full px-6 group">
                  Join the Community
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-2">
                <Button 
                  variant={activeTab === 'featured' ? 'default' : 'outline'} 
                  onClick={() => setActiveTab('featured')}
                  className="rounded-full"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Featured
                </Button>
                <Button 
                  variant={activeTab === 'popular' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('popular')}
                  className="rounded-full"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Popular
                </Button>
                <Button 
                  variant={activeTab === 'new' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('new')}
                  className="rounded-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedHubs.map((hub) => (
                <motion.div
                  key={hub.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="overflow-hidden border-primary/10 hover:border-primary/30 transition-all duration-300">
                    <div className="h-32 bg-gradient-to-r from-primary/5 to-secondary/5 flex items-center justify-center">
                      <div className="text-4xl font-mythical text-primary/40">{hub.name.charAt(0)}</div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{hub.name}</CardTitle>
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription className="line-clamp-2">{hub.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {hub.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="font-normal text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1.5" />
                          {hub.members.toLocaleString()} members
                        </div>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                          {hub.active} online
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full justify-between group" size="sm">
                        View Community
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline" className="rounded-full">
                <Compass className="mr-2 h-4 w-4" />
                Explore All Communities
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Sparkles, MessageSquare, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
}

interface Subscription {
  active: boolean;
  expiresAt?: string;
}

const CommunityHub: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [subscription, setSubscription] = useState<Subscription>({ active: false });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discussions');

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the Community Hub",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    checkSubscription();
    fetchPosts();
  }, [user]);

  const checkSubscription = async () => {
    try {
      // In a real application, this would make an API call to verify subscription
      // For now, we're mocking subscription data
      const mockSubscriptionActive = localStorage.getItem('community_subscription') === 'active';
      
      setSubscription({
        active: mockSubscriptionActive,
        expiresAt: mockSubscriptionActive ? '2024-12-31' : undefined
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      // This would typically fetch posts from your database
      // For now, we're using mock data
      const mockPosts: CommunityPost[] = [
        {
          id: '1',
          title: 'Norse Mythology Discussion',
          content: 'What are your favorite tales of Thor and Odin?',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          user_id: '123',
          username: 'MythologyFan'
        },
        {
          id: '2',
          title: 'Greek vs Roman Pantheons',
          content: 'Let\'s discuss the similarities and differences between Greek and Roman gods.',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          user_id: '456',
          username: 'ClassicalScholar'
        },
        {
          id: '3',
          title: 'Interpretation of Egyptian Hieroglyphs',
          content: 'I found these interesting hieroglyphs in an old book. Any experts here?',
          created_at: new Date(Date.now() - 259200000).toISOString(),
          user_id: '789',
          username: 'EgyptExplorer'
        }
      ];
      
      setPosts(mockPosts);
    } catch (error) {
      console.error('Error fetching community posts:', error);
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive",
      });
    }
  };

  const handleSubscribe = () => {
    // In a real app, this would redirect to a payment page
    localStorage.setItem('community_subscription', 'active');
    setSubscription({ active: true, expiresAt: '2024-12-31' });
    toast({
      title: "Subscription Activated",
      description: "You now have access to the MythoAI Community Hub!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!subscription.active) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow pt-28 pb-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <div className="flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary mr-2" />
                <h1 className="text-4xl md:text-5xl font-mythical bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Community Hub
                </h1>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Join our exclusive community of mythology enthusiasts to discuss stories, share interpretations, 
                and collaborate on mythological research.
              </p>
            </motion.div>
            
            <div className="max-w-md mx-auto">
              <Card className="border-primary/20 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Community Subscription
                  </CardTitle>
                  <CardDescription>
                    Unlock exclusive access to our mythology community
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <span>Participate in mythology discussions</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <span>Connect with fellow enthusiasts</span>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <span>Access to exclusive content</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="text-3xl font-bold">$4.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSubscribe} className="w-full">
                    Subscribe Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-4xl md:text-5xl font-mythical bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Community Hub
              </h1>
            </div>
            
            <div className="flex items-center justify-center">
              <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs px-2.5 py-0.5 rounded-full flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Active Subscription
              </span>
              {subscription.expiresAt && (
                <span className="text-xs text-muted-foreground ml-2">
                  Expires: {new Date(subscription.expiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              
              <TabsContent value="discussions">
                <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                  {posts.map(post => (
                    <Card key={post.id} className="glass">
                      <CardHeader>
                        <CardTitle>{post.title}</CardTitle>
                        <CardDescription>
                          Posted by {post.username} • {new Date(post.created_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{post.content}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Reply
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="members">
                <div className="text-center py-12">
                  <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Community Members</h3>
                  <p className="text-muted-foreground">
                    Coming soon! Member profiles and connection features are under development.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="resources">
                <div className="text-center py-12">
                  <Lock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">Exclusive Resources</h3>
                  <p className="text-muted-foreground">
                    Coming soon! Exclusive mythology resources and downloads are being prepared.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommunityHub;

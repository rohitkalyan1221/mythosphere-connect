
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Loader2, Sparkles, BookOpen } from "lucide-react";
import { generateStory, StoryPrompt, StoryResponse } from "@/lib/gemini";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const mythologies = [
  "Greek", "Norse", "Egyptian", "Celtic", "Japanese", 
  "Chinese", "Hindu", "Mesopotamian", "Mayan", "Aztec",
  "African", "Native American", "Polynesian", "Slavic", "Persian"
];

const themes = [
  "Creation", "Heroism", "Love", "Tragedy", "Redemption", 
  "Transformation", "Adventure", "Wisdom", "Revenge", "Sacrifice",
  "Underworld", "Trickery", "Justice", "Hubris", "Fate"
];

const StoryGenerator: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [useApiKey, setUseApiKey] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState<StoryPrompt>({
    mythology: "Greek",
    character: "",
    theme: "Heroism",
    length: "medium"
  });
  const [generatedStory, setGeneratedStory] = useState<StoryResponse | null>(null);

  const handleGenerate = async () => {
    if (!apiKey && useApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to generate a story",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, if no API key is provided, show sample story
      if (!useApiKey) {
        setTimeout(() => {
          setGeneratedStory({
            title: "The Trials of Odysseus",
            story: "In the ancient days, when gods walked among men, the clever Odysseus found himself far from home after the fall of Troy. Cursed by Poseidon for blinding his son, the Cyclops Polyphemus, Odysseus was doomed to wander the wine-dark sea for ten long years.\n\nHis journey took him to the land of the Lotus-eaters, where his men nearly forgot their homeland. He outwitted the sorceress Circe, who had transformed his crew into swine. He sailed past the Sirens, whose enchanting songs lured sailors to their doom, by having his men plug their ears with wax while he alone listened, bound tightly to the mast.\n\nHe navigated between Scylla, the six-headed monster, and Charybdis, the deadly whirlpool. He visited the underworld to seek guidance from the prophet Tiresias. Throughout his trials, Odysseus demonstrated remarkable cunning, resilience, and leadership.\n\nMeanwhile, back on Ithaca, his faithful wife Penelope cleverly delayed her suitors by weaving a burial shroud for Odysseus's father by day and unraveling it by night. Their son Telemachus grew into a man, searching for news of his long-lost father.\n\nWhen Odysseus finally returned, disguised as a beggar, he slew the suitors who had been consuming his wealth and threatening his household. With the help of Athena, he reclaimed his kingdom and reunited with his beloved Penelope, proving that determination and wisdom can overcome even the wrath of the gods."
          });
          setLoading(false);
        }, 1500);
        return;
      }
      
      const story = await generateStory(apiKey, storyPrompt);
      setGeneratedStory(story);
    } catch (error) {
      console.error("Failed to generate story:", error);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-primary/20 overflow-hidden glass">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          Mythological Story Generator
        </CardTitle>
        <CardDescription>
          Create authentic mythological tales with AI assistance
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid grid-cols-2 mx-6 my-2">
          <TabsTrigger value="create">Create Story</TabsTrigger>
          <TabsTrigger value="read">Read Story</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="p-0">
          <CardContent className="space-y-4 pt-6">
            <div className="flex justify-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-api-key"
                  checked={useApiKey}
                  onCheckedChange={setUseApiKey}
                />
                <Label htmlFor="use-api-key">Use API Key</Label>
              </div>
            </div>
            
            {useApiKey && (
              <div className="space-y-2">
                <Label htmlFor="api-key">Gemini API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is only used in your browser and not stored on our servers
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="mythology">Mythology</Label>
              <Select
                value={storyPrompt.mythology}
                onValueChange={(value) => setStoryPrompt({...storyPrompt, mythology: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a mythology" />
                </SelectTrigger>
                <SelectContent>
                  {mythologies.map((myth) => (
                    <SelectItem key={myth} value={myth}>
                      {myth}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="character">Main Character (optional)</Label>
              <Input
                id="character"
                placeholder="e.g. Zeus, Thor, Isis..."
                value={storyPrompt.character || ""}
                onChange={(e) => setStoryPrompt({...storyPrompt, character: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={storyPrompt.theme || ""}
                onValueChange={(value) => setStoryPrompt({...storyPrompt, theme: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="length">Story Length</Label>
              <Select
                value={storyPrompt.length || "medium"}
                onValueChange={(value: "short" | "medium" | "long") => 
                  setStoryPrompt({...storyPrompt, length: value})
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              disabled={loading} 
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Mythological Story
                </>
              )}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="read" className="p-0">
          <CardContent className="pt-6">
            {generatedStory ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="border-b pb-2">
                  <h3 className="text-xl font-mythical text-primary">{generatedStory.title}</h3>
                </div>
                
                <ScrollArea className="h-[300px] rounded-md">
                  <div className="prose dark:prose-invert max-w-none">
                    {generatedStory.story.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            ) : (
              <div className="text-center p-10 text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p>Generate a story first to read it here</p>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default StoryGenerator;

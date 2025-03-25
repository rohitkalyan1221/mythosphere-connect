
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
import { Loader2, Sparkles, BookOpen, Image as ImageIcon } from "lucide-react";
import { generateStory, StoryPrompt, StoryResponse } from "@/lib/gemini";
import { generateImage, PixlrResponse } from "@/lib/pixlr";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

const DEFAULT_API_KEY = "AIzaSyDh9F57_FwugkK3-dV3caqphtbI9yDaXYI";
const DEFAULT_PIXLR_KEY = "92b0e3fac21b463682ec42c523173401";

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
  const [apiKey, setApiKey] = useState<string>(DEFAULT_API_KEY);
  const [pixlrApiKey, setPixlrApiKey] = useState<string>(DEFAULT_PIXLR_KEY);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [useCustomApiKey, setUseCustomApiKey] = useState(false);
  const [useCustomPixlrKey, setUseCustomPixlrKey] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState<StoryPrompt>({
    mythology: "Greek",
    character: "",
    theme: "Heroism",
    length: "medium"
  });
  const [generatedStory, setGeneratedStory] = useState<StoryResponse | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("create");

  const handleGenerate = async () => {
    const keyToUse = useCustomApiKey ? apiKey : DEFAULT_API_KEY;
    
    if (!keyToUse) {
      toast({
        title: "API Key Required",
        description: "Please enter a Gemini API key to generate a story",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const story = await generateStory(keyToUse, storyPrompt);
      setGeneratedStory(story);
      
      if (story.error) {
        toast({
          title: "Generation Error",
          description: story.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Story Generated",
          description: `"${story.title}" has been created successfully`,
        });
        setActiveTab("read");
      }
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

  const handleGenerateImage = async () => {
    if (!generatedStory) {
      toast({
        title: "No Story Found",
        description: "Please generate a story first before creating an image",
        variant: "destructive",
      });
      return;
    }
    
    const pixlrKey = useCustomPixlrKey ? pixlrApiKey : DEFAULT_PIXLR_KEY;
    
    if (!pixlrKey) {
      toast({
        title: "API Key Required",
        description: "Please enter a Pixlr API key to generate an image",
        variant: "destructive",
      });
      return;
    }

    setImageLoading(true);
    try {
      // Create a prompt based on the story title and mythology
      const imagePrompt = `${generatedStory.title}, ${storyPrompt.mythology} mythology, epic scene, dramatic lighting, detailed illustration`;
      
      const result = await generateImage({
        prompt: imagePrompt,
        apiKey: pixlrKey
      });
      
      if (result.error) {
        toast({
          title: "Image Generation Error",
          description: result.error,
          variant: "destructive",
        });
      } else if (result.url) {
        setGeneratedImage(result.url);
        toast({
          title: "Image Generated",
          description: "Your mythological scene has been illustrated",
        });
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast({
        title: "Image Generation Failed",
        description: "There was an error generating your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImageLoading(false);
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
          Create authentic mythological tales with Gemini AI assistance
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  checked={useCustomApiKey}
                  onCheckedChange={setUseCustomApiKey}
                />
                <Label htmlFor="use-api-key">Use Custom API Key</Label>
              </div>
            </div>
            
            {useCustomApiKey && (
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
            
            <div className="flex justify-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-pixlr-key"
                  checked={useCustomPixlrKey}
                  onCheckedChange={setUseCustomPixlrKey}
                />
                <Label htmlFor="use-pixlr-key">Use Custom Pixlr Key</Label>
              </div>
            </div>
            
            {useCustomPixlrKey && (
              <div className="space-y-2">
                <Label htmlFor="pixlr-key">Pixlr API Key</Label>
                <Input
                  id="pixlr-key"
                  type="password"
                  placeholder="Enter your Pixlr API key"
                  value={pixlrApiKey}
                  onChange={(e) => setPixlrApiKey(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is only used in your browser and not stored on our servers
                </p>
              </div>
            )}
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
                
                {generatedImage ? (
                  <div className="relative rounded-md overflow-hidden aspect-[16/9] mb-6">
                    <img 
                      src={generatedImage} 
                      alt={generatedStory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2">
                      <p className="text-xs opacity-70 bg-black/30 text-white px-2 py-1 rounded-md">
                        Generated with Pixlr AI
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center mb-4">
                    <Button
                      onClick={handleGenerateImage}
                      disabled={imageLoading}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      {imageLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Image...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Generate Scene Image
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
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

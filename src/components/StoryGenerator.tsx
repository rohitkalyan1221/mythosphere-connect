import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Loader2, Sparkles, BookOpen, Image as ImageIcon, MessageSquare, Box } from "lucide-react";
import { generateStory, StoryPrompt, StoryResponse, StoryArc } from "@/lib/gemini";
import { generateImage, StabilityResponse } from "@/lib/stability";
import { generateModel, checkModelStatus, MeshyResponse } from "@/lib/meshy";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DEFAULT_API_KEY = "AIzaSyDh9F57_FwugkK3-dV3caqphtbI9yDaXYI";
const DEFAULT_STABILITY_KEY = "sk-xqnIAFadjtu4CGLww0ZG0wII3DfZ6VCwVWAWxU8oRFYsyR2A";
const DEFAULT_MESHY_KEY = "msy_A95tIfxXvNXtSTzQ0b7hBCNbL8psuei8ZeVm";

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
  const [stabilityApiKey, setStabilityApiKey] = useState<string>(DEFAULT_STABILITY_KEY);
  const [meshyApiKey, setMeshyApiKey] = useState<string>(DEFAULT_MESHY_KEY);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [useCustomApiKey, setUseCustomApiKey] = useState(false);
  const [useCustomStabilityKey, setUseCustomStabilityKey] = useState(false);
  const [useCustomMeshyKey, setUseCustomMeshyKey] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState<StoryPrompt>({
    mythology: "Greek",
    character: "",
    theme: "Heroism",
    length: "medium"
  });
  const [generatedStory, setGeneratedStory] = useState<StoryResponse | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedModel, setGeneratedModel] = useState<MeshyResponse | null>(null);
  const [activeTab, setActiveTab] = useState<string>("create");
  const [customImagePrompt, setCustomImagePrompt] = useState<string>("");
  const [customModelPrompt, setCustomModelPrompt] = useState<string>("");
  const [showArcsView, setShowArcsView] = useState<boolean>(true);
  const [modelTaskId, setModelTaskId] = useState<string | null>(null);
  const [modelPollingInterval, setModelPollingInterval] = useState<number | null>(null);

  useEffect(() => {
    if (modelTaskId) {
      const interval = window.setInterval(async () => {
        try {
          const meshyKey = useCustomMeshyKey ? meshyApiKey : DEFAULT_MESHY_KEY;
          const status = await checkModelStatus(modelTaskId, meshyKey);
          
          if (status.error) {
            clearInterval(interval);
            setModelLoading(false);
            setModelTaskId(null);
            toast({
              title: "Model Generation Failed",
              description: status.error,
              variant: "destructive",
            });
          } else if (status.modelUrl) {
            clearInterval(interval);
            setModelLoading(false);
            setModelTaskId(null);
            setGeneratedModel(status);
            toast({
              title: "3D Model Generated",
              description: "Your mythological character has been modeled in 3D",
            });
          }
        } catch (error) {
          console.error("Error polling model status:", error);
          clearInterval(interval);
          setModelLoading(false);
          setModelTaskId(null);
        }
      }, 10000);
      
      setModelPollingInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [modelTaskId, meshyApiKey, useCustomMeshyKey]);

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
      setGeneratedImage(null);
      setCustomImagePrompt("");
      
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
    
    const stabilityKey = useCustomStabilityKey ? stabilityApiKey : DEFAULT_STABILITY_KEY;
    
    if (!stabilityKey) {
      toast({
        title: "API Key Required",
        description: "Please enter a Stability AI API key to generate an image",
        variant: "destructive",
      });
      return;
    }

    setImageLoading(true);
    try {
      const imagePrompt = customImagePrompt.trim() !== "" 
        ? customImagePrompt
        : `${generatedStory.title}, ${storyPrompt.mythology} mythology, epic scene, dramatic lighting, detailed illustration`;
      
      console.log("Generating image with prompt:", imagePrompt);
      
      const result = await generateImage({
        prompt: imagePrompt,
        apiKey: stabilityKey
      });
      
      console.log("Image generation result:", result);
      
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
      } else {
        toast({
          title: "Image Generation Error",
          description: "No image URL was returned",
          variant: "destructive",
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

  const handleGenerateModel = async () => {
    if (!generatedStory) {
      toast({
        title: "No Story Found",
        description: "Please generate a story first before creating a 3D model",
        variant: "destructive",
      });
      return;
    }
    
    const meshyKey = useCustomMeshyKey ? meshyApiKey : DEFAULT_MESHY_KEY;
    
    if (!meshyKey) {
      toast({
        title: "API Key Required",
        description: "Please enter a Meshy AI API key to generate a 3D model",
        variant: "destructive",
      });
      return;
    }

    setModelLoading(true);
    try {
      let characterPrompt;
      if (customModelPrompt.trim() !== "") {
        characterPrompt = customModelPrompt;
      } else if (storyPrompt.character) {
        characterPrompt = `${storyPrompt.character} from ${storyPrompt.mythology} mythology, full body, detailed, 3D character`;
      } else {
        const defaultCharacter = generatedStory.title.split(" ")[0];
        characterPrompt = `${defaultCharacter} from ${storyPrompt.mythology} mythology, full body, detailed, 3D character`;
      }
      
      console.log("Generating 3D model with prompt:", characterPrompt);
      
      const result = await generateModel({
        prompt: characterPrompt,
        apiKey: meshyKey
      });
      
      console.log("Model generation result:", result);
      
      if (result.error) {
        toast({
          title: "Model Generation Error",
          description: result.error,
          variant: "destructive",
        });
        setModelLoading(false);
      } else if (result.taskId) {
        setModelTaskId(result.taskId);
        toast({
          title: "Model Generation Started",
          description: "Your 3D model is being created. This may take a few minutes.",
        });
      } else {
        toast({
          title: "Model Generation Error",
          description: "No task ID was returned",
          variant: "destructive",
        });
        setModelLoading(false);
      }
    } catch (error) {
      console.error("Failed to generate 3D model:", error);
      toast({
        title: "Model Generation Failed",
        description: "There was an error generating your 3D model. Please try again.",
        variant: "destructive",
      });
      setModelLoading(false);
    }
  };

  const renderStoryContent = () => {
    if (!generatedStory) return null;

    if (showArcsView && generatedStory.storyArcs && generatedStory.storyArcs.length > 0) {
      return (
        <Accordion type="single" collapsible className="w-full">
          {generatedStory.storyArcs.map((arc, index) => (
            <AccordionItem key={index} value={`arc-${index}`}>
              <AccordionTrigger className="text-md font-medium hover:text-primary">
                {arc.title}
              </AccordionTrigger>
              <AccordionContent className="prose dark:prose-invert max-w-none">
                {arc.content.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    }

    return (
      <div className="prose dark:prose-invert max-w-none">
        {generatedStory.story.split('\n\n').map((paragraph, i) => (
          <p key={i} className="mb-4">{paragraph}</p>
        ))}
      </div>
    );
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
                  id="use-stability-key"
                  checked={useCustomStabilityKey}
                  onCheckedChange={setUseCustomStabilityKey}
                />
                <Label htmlFor="use-stability-key">Use Custom Stability AI Key</Label>
              </div>
            </div>
            
            {useCustomStabilityKey && (
              <div className="space-y-2">
                <Label htmlFor="stability-key">Stability AI API Key</Label>
                <Input
                  id="stability-key"
                  type="password"
                  placeholder="Enter your Stability AI API key"
                  value={stabilityApiKey}
                  onChange={(e) => setStabilityApiKey(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is only used in your browser and not stored on our servers
                </p>
              </div>
            )}
            
            <div className="flex justify-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="use-meshy-key"
                  checked={useCustomMeshyKey}
                  onCheckedChange={setUseCustomMeshyKey}
                />
                <Label htmlFor="use-meshy-key">Use Custom Meshy AI Key</Label>
              </div>
            </div>
            
            {useCustomMeshyKey && (
              <div className="space-y-2">
                <Label htmlFor="meshy-key">Meshy AI API Key</Label>
                <Input
                  id="meshy-key"
                  type="password"
                  placeholder="Enter your Meshy AI API key"
                  value={meshyApiKey}
                  onChange={(e) => setMeshyApiKey(e.target.value)}
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
                        Generated with Stability AI
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="custom-prompt">Custom Image Prompt (optional)</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="custom-prompt"
                          placeholder="Enter a specific scene or visual you'd like to generate..."
                          value={customImagePrompt}
                          onChange={(e) => setCustomImagePrompt(e.target.value)}
                          className="resize-none"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Describe the scene you want to visualize, or leave empty to generate based on the story
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
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
                  </div>
                )}
                
                {generatedModel && generatedModel.modelUrl ? (
                  <div className="space-y-4 mb-6">
                    <div className="border-t pt-4 mb-2">
                      <h4 className="text-lg font-semibold">3D Character Model</h4>
                    </div>
                    <div className="flex flex-col items-center">
                      {generatedModel.thumbnailUrl && (
                        <div className="relative w-full max-w-xs mb-4">
                          <img 
                            src={generatedModel.thumbnailUrl} 
                            alt="3D Model Thumbnail"
                            className="w-full h-auto rounded-md shadow-md"
                          />
                        </div>
                      )}
                      <div className="flex gap-4">
                        <Button
                          onClick={() => window.open(generatedModel.modelUrl, '_blank')}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Box className="h-4 w-4" />
                          View 3D Model
                        </Button>
                        {generatedModel.glbUrl && (
                          <Button
                            onClick={() => window.open(generatedModel.glbUrl, '_blank')}
                            variant="outline"
                            className="flex items-center gap-2"
                          >
                            <Box className="h-4 w-4" />
                            Download GLB
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6 border-t pt-4">
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold">Generate 3D Character</h4>
                      <Label htmlFor="custom-model-prompt">Custom Character Prompt (optional)</Label>
                      <div className="flex gap-2">
                        <Textarea
                          id="custom-model-prompt"
                          placeholder="Describe the character you want to generate in 3D..."
                          value={customModelPrompt}
                          onChange={(e) => setCustomModelPrompt(e.target.value)}
                          className="resize-none"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Describe the mythological character in detail, or leave empty to generate based on the story
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        onClick={handleGenerateModel}
                        disabled={modelLoading}
                        variant="outline"
                        className="w-full sm:w-auto"
                      >
                        {modelLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating 3D Model...
                          </>
                        ) : (
                          <>
                            <Box className="mr-2 h-4 w-4" />
                            Generate 3D Character
                          </>
                        )}
                      </Button>
                    </div>
                    {modelLoading && (
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        3D model generation can take several minutes. Please be patient.
                      </p>
                    )}
                  </div>
                )}
                
                {generatedStory.storyArcs && generatedStory.storyArcs.length > 0 && (
                  <div className="flex items-center justify-end space-x-2 mb-4">
                    <Label htmlFor="show-arcs" className="text-sm">Show as Story Arcs</Label>
                    <Switch
                      id="show-arcs"
                      checked={showArcsView}
                      onCheckedChange={setShowArcsView}
                    />
                  </div>
                )}
                
                <ScrollArea className="h-[350px] rounded-md">
                  {renderStoryContent()}
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


import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Loader2, Sparkles, BookOpen, Image as ImageIcon, MessageSquare, Bookmark, RefreshCcw, Gift, Volume2, Pause, Play, Mic, MicOff } from "lucide-react";
import { generateStory, StoryPrompt, StoryResponse, StoryArc } from "@/lib/gemini";
import { generateImage, StabilityResponse } from "@/lib/stability";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

const DEFAULT_API_KEY = "AIzaSyDh9F57_FwugkK3-dV3caqphtbI9yDaXYI";
const DEFAULT_STABILITY_KEY = "sk-xqnIAFadjtu4CGLww0ZG0wII3DfZ6VCwVWAWxU8oRFYsyR2A";

const voices = [
  { id: "default", name: "Default" },
  { id: "female", name: "Female" },
  { id: "male", name: "Male" }
];

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
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [useCustomApiKey, setUseCustomApiKey] = useState(false);
  const [useCustomStabilityKey, setUseCustomStabilityKey] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState<StoryPrompt>({
    mythology: "Greek",
    character: "",
    theme: "Heroism",
    length: "medium"
  });
  const [generatedStory, setGeneratedStory] = useState<StoryResponse | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("create");
  const [customImagePrompt, setCustomImagePrompt] = useState<string>("");
  const [showArcsView, setShowArcsView] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<string>("default");
  const [voiceProgress, setVoiceProgress] = useState<number>(0);
  const [savedStories, setSavedStories] = useState<StoryResponse[]>(
    JSON.parse(localStorage.getItem('savedStories') || '[]')
  );
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const speechUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const recognition = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setRecognitionSupported(true);
      
      // Use the appropriate SpeechRecognition interface based on browser support
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        recognition.current = new SpeechRecognitionAPI();
        recognition.current.continuous = true;
        recognition.current.interimResults = true;
        
        recognition.current.onresult = (event) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const transcript = result[0].transcript;
          
          if (result.isFinal) {
            setTranscript(prevTranscript => prevTranscript + ' ' + transcript);
          }
        };
        
        recognition.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          toast({
            title: "Recognition Error",
            description: `Error: ${event.error}`,
            variant: "destructive",
          });
        };
        
        recognition.current.onend = () => {
          if (isListening) {
            recognition.current?.start();
          }
        };
      }
    }
    
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
    
    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      if (speechSynthesis.current && speechUtterance.current) {
        speechSynthesis.current.cancel();
      }
    };
  }, [isListening]);
  
  const toggleListening = () => {
    if (!recognitionSupported) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      if (recognition.current) {
        recognition.current.stop();
      }
      setIsListening(false);
    } else {
      setTranscript("");
      if (recognition.current) {
        recognition.current.start();
      }
      setIsListening(true);
    }
  };
  
  const useTranscriptAsPrompt = () => {
    if (transcript.trim()) {
      const mythologyMatch = mythologies.find(m => 
        transcript.toLowerCase().includes(m.toLowerCase())
      );
      
      const themeMatch = themes.find(t => 
        transcript.toLowerCase().includes(t.toLowerCase())
      );
      
      setStoryPrompt(prev => ({
        ...prev,
        mythology: mythologyMatch || prev.mythology,
        theme: themeMatch || prev.theme,
        character: transcript.trim()
      }));
      
      toast({
        title: "Prompt Updated",
        description: "Your spoken text has been added to the story prompt",
      });
    }
  };

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

  const handleGenerateVoice = async () => {
    if (!generatedStory) {
      toast({
        title: "No Story Found",
        description: "Please generate a story first before creating a narration",
        variant: "destructive",
      });
      return;
    }
    
    setVoiceLoading(true);
    try {
      if (speechSynthesis.current) {
        speechSynthesis.current.cancel();
        setIsPlaying(false);
      }
      
      const textToNarrate = showArcsView && generatedStory.storyArcs && generatedStory.storyArcs.length > 0
        ? generatedStory.storyArcs.map(arc => `${arc.title}. ${arc.content}`).join(' ')
        : generatedStory.story;
        
      setVoiceProgress(50);
      
      speechUtterance.current = new SpeechSynthesisUtterance(textToNarrate);
      
      if (speechSynthesis.current) {
        const voices = speechSynthesis.current.getVoices();
        
        if (voices.length > 0) {
          let selectedSynthVoice;
          
          switch (selectedVoice) {
            case 'female':
              selectedSynthVoice = voices.find(voice => voice.name.includes('female') || voice.name.includes('woman'));
              break;
            case 'male':
              selectedSynthVoice = voices.find(voice => voice.name.includes('male') || voice.name.includes('man'));
              break;
            default:
              selectedSynthVoice = voices[0];
          }
          
          if (selectedSynthVoice) {
            speechUtterance.current.voice = selectedSynthVoice;
          }
        }
      }
      
      speechUtterance.current.onstart = () => {
        setIsPlaying(true);
      };
      
      speechUtterance.current.onend = () => {
        setIsPlaying(false);
      };
      
      speechUtterance.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        toast({
          title: "Speech Error",
          description: "There was an error during speech synthesis",
          variant: "destructive",
        });
      };
      
      setVoiceProgress(100);
      
      if (speechSynthesis.current) {
        speechSynthesis.current.speak(speechUtterance.current);
      }
      
      toast({
        title: "Narration Created",
        description: "Your mythological story is being narrated",
      });
    } catch (error) {
      console.error("Failed to generate voice narration:", error);
      toast({
        title: "Voice Generation Failed",
        description: error instanceof Error ? error.message : "There was an error generating your narration",
        variant: "destructive",
      });
    } finally {
      setVoiceLoading(false);
      setVoiceProgress(0);
    }
  };

  const togglePlayPause = () => {
    if (!speechSynthesis.current) return;
    
    if (isPlaying) {
      speechSynthesis.current.pause();
      setIsPlaying(false);
    } else {
      if (speechSynthesis.current.paused) {
        speechSynthesis.current.resume();
      } else if (speechUtterance.current) {
        speechSynthesis.current.speak(speechUtterance.current);
      }
      setIsPlaying(true);
    }
  };

  const saveStory = () => {
    if (!generatedStory) return;
    
    const storyToSave = {
      ...generatedStory
    };
    
    const newSavedStories = [...savedStories, storyToSave];
    setSavedStories(newSavedStories);
    localStorage.setItem('savedStories', JSON.stringify(newSavedStories));
    
    toast({
      title: "Story Saved",
      description: "Your story has been saved to your collection",
    });
  };

  const renderStoryContent = () => {
    if (!generatedStory) return null;

    if (showArcsView && generatedStory.storyArcs && generatedStory.storyArcs.length > 0) {
      return (
        <Accordion type="single" collapsible className="w-full">
          {generatedStory.storyArcs.map((arc, index) => (
            <AccordionItem key={index} value={`arc-${index}`} className="border-b border-primary/10">
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
        <CardDescription className="text-base">
          Create authentic mythological tales with Gemini AI assistance
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mx-6 my-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4" />
            Create Story
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Read Story
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="p-0">
          <CardContent className="space-y-5 pt-6">
            <div className="bg-muted/40 rounded-lg p-4 border border-primary/10">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                Voice Input
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Speak your story ideas</Label>
                    <Button 
                      variant={isListening ? "destructive" : "outline"} 
                      size="sm"
                      onClick={toggleListening}
                      className="flex items-center gap-2"
                      disabled={!recognitionSupported}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          Stop Listening
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Start Listening
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <Textarea 
                    placeholder={recognitionSupported ? "Your spoken text will appear here..." : "Speech recognition is not supported in your browser"}
                    value={transcript}
                    onChange={e => setTranscript(e.target.value)}
                    className={`min-h-[100px] ${isListening ? 'border-primary' : ''}`}
                  />
                  
                  {transcript && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={useTranscriptAsPrompt}
                      className="self-end"
                    >
                      Use as Prompt
                    </Button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 rounded-lg p-4 border border-primary/10">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                Story Parameters
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="character">Main Character or Story Idea</Label>
                  <Input
                    id="character"
                    placeholder="e.g. Zeus, Thor, Isis or describe your story idea"
                    value={storyPrompt.character || ""}
                    onChange={(e) => setStoryPrompt({...storyPrompt, character: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="length">Story Length</Label>
                  <div className="flex space-x-2 items-center">
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
                    <Badge variant="outline" className="min-w-[60px] justify-center">
                      {storyPrompt.length === "short" ? "~5 min" : 
                       storyPrompt.length === "medium" ? "~10 min" : "~15 min"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 rounded-lg p-4 border border-primary/10">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-primary" />
                Voice Narration
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="voice">Narrator Voice</Label>
                  <Select
                    value={selectedVoice}
                    onValueChange={setSelectedVoice}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose a voice for your story narration
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/40 rounded-lg p-4 border border-primary/10">
              <h3 className="text-lg font-semibold mb-3">API Settings</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="use-api-key" className="font-medium">Gemini API Key</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-api-key"
                      checked={useCustomApiKey}
                      onCheckedChange={setUseCustomApiKey}
                    />
                    <Label htmlFor="use-api-key">Use Custom Key</Label>
                  </div>
                </div>
                
                {useCustomApiKey && (
                  <div className="space-y-2">
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
                
                <div className="flex justify-between items-center">
                  <Label htmlFor="use-stability-key" className="font-medium">Stability AI Key</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-stability-key"
                      checked={useCustomStabilityKey}
                      onCheckedChange={setUseCustomStabilityKey}
                    />
                    <Label htmlFor="use-stability-key">Use Custom Key</Label>
                  </div>
                </div>
                
                {useCustomStabilityKey && (
                  <div className="space-y-2">
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
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pb-6">
            <Button 
              onClick={handleGenerate} 
              disabled={loading} 
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Weaving your mythological tale...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
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
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="text-2xl font-mythical text-primary">{generatedStory.title}</h3>
                  <div className="flex gap-2">
                    {isPlaying !== null && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Play
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={saveStory}
                    >
                      <Bookmark className="h-4 w-4" />
                      Save Story
                    </Button>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 flex flex-wrap gap-2">
                  <Badge>{storyPrompt.mythology} Mythology</Badge>
                  {storyPrompt.theme && <Badge variant="outline">{storyPrompt.theme}</Badge>}
                  {storyPrompt.character && <Badge variant="secondary">{storyPrompt.character}</Badge>}
                </div>

                <div className="space-y-4 mb-6 p-4 bg-muted/30 rounded-lg border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-primary" />
                      Generate Voice Narration
                    </h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="narration-voice" className="min-w-[80px]">Voice:</Label>
                      <Select
                        value={selectedVoice}
                        onValueChange={setSelectedVoice}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select a voice" />
                        </SelectTrigger>
                        <SelectContent>
                          {voices.map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              {voice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {voiceProgress > 0 && <Progress value={voiceProgress} className="h-2" />}
                  
                  <div className="flex justify-center">
                    <Button
                      onClick={handleGenerateVoice}
                      disabled={voiceLoading}
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      {voiceLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Narration...
                        </>
                      ) : (
                        <>
                          <Volume2 className="mr-2 h-4 w-4" />
                          Generate Audio Narration
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {generatedImage ? (
                  <div className="relative rounded-md overflow-hidden aspect-[16/9] mb-6 shadow-lg">
                    <img 
                      src={generatedImage} 
                      alt={generatedStory.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <p className="text-sm text-white font-medium">
                        Scene from "{generatedStory.title}"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 mb-6 p-4 bg-muted/30 rounded-lg border border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-primary" />
                        Visualize Scene
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Describe a scene from your story you'd like to visualize..."
                        value={customImagePrompt}
                        onChange={(e) => setCustomImagePrompt(e.target.value)}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Describe the scene you want to visualize, or leave empty to generate based on the story
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button
                        onClick={handleGenerateImage}
                        disabled={imageLoading}
                        variant="secondary"
                        className="w-full sm:w-auto"
                      >
                        {imageLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Scene...
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
                
                {isPlaying !== null && (
                  <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full ${isPlaying ? 'bg-primary text-white' : ''}`}
                        onClick={togglePlayPause}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div>
                        <p className="text-sm font-medium">Audio Narration</p>
                        <p className="text-xs text-muted-foreground">
                          {isPlaying ? "Playing..." : "Paused"}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Voice: {voices.find(v => v.id === selectedVoice)?.name || "Default"}
                    </div>
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
                
                <div className="bg-card rounded-lg shadow-inner p-4 border border-accent/10">
                  <ScrollArea className="h-[350px] pr-4">
                    {renderStoryContent()}
                  </ScrollArea>
                </div>
              </motion.div>
            ) : (
              <div className="text-center p-10 text-muted-foreground bg-muted/30 rounded-lg">
                <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-50" />
                <p>Generate a story first to read it here</p>
                <Button 
                  variant="link"
                >
                  <MessageSquare className="h-5 w-5" />
                  Generate Story
                </Button>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default StoryGenerator;

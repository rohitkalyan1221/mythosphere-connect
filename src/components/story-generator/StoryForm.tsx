
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Sparkles, Gift, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateStory, StoryPrompt, StoryResponse } from "@/lib/gemini";
import { toast } from "@/hooks/use-toast";

const DEFAULT_API_KEY = "AIzaSyDh9F57_FwugkK3-dV3caqphtbI9yDaXYI";
const DEFAULT_STABILITY_KEY = "sk-xqnIAFadjtu4CGLww0ZG0wII3DfZ6VCwVWAWxU8oRFYsyR2A";

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

const voices = [
  { id: "default", name: "Default" },
  { id: "female", name: "Female" },
  { id: "male", name: "Male" }
];

interface StoryFormProps {
  setGeneratedStory: React.Dispatch<React.SetStateAction<StoryResponse | null>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export const StoryForm: React.FC<StoryFormProps> = ({ setGeneratedStory, setActiveTab }) => {
  const [loading, setLoading] = useState(false);
  const [useCustomApiKey, setUseCustomApiKey] = useState(false);
  const [useCustomStabilityKey, setUseCustomStabilityKey] = useState(false);
  const [apiKey, setApiKey] = useState<string>(DEFAULT_API_KEY);
  const [stabilityApiKey, setStabilityApiKey] = useState<string>(DEFAULT_STABILITY_KEY);
  const [selectedVoice, setSelectedVoice] = useState<string>("default");
  const [storyPrompt, setStoryPrompt] = useState<StoryPrompt>({
    mythology: "Greek",
    character: "",
    theme: "Heroism",
    length: "medium"
  });

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

  return (
    <>
      <CardContent className="space-y-5 pt-6">
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
    </>
  );
};

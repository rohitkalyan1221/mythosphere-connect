
import React, { useState } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Bookmark } from "lucide-react";
import { StoryResponse } from "@/lib/gemini";
import { toast } from "@/hooks/use-toast";
import { VoiceControls } from "./VoiceControls";
import { ImageGenerator } from "./ImageGenerator";
import { StoryContent } from "./StoryContent";

interface StoryReaderProps {
  generatedStory: StoryResponse | null;
  generatedImage: string | null;
  customImagePrompt: string;
  setGeneratedImage: React.Dispatch<React.SetStateAction<string | null>>;
  setCustomImagePrompt: React.Dispatch<React.SetStateAction<string>>;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  generatedStory,
  generatedImage,
  customImagePrompt,
  setGeneratedImage,
  setCustomImagePrompt
}) => {
  const [showArcsView, setShowArcsView] = useState<boolean>(true);
  const [savedStories, setSavedStories] = useState<StoryResponse[]>(
    JSON.parse(localStorage.getItem('savedStories') || '[]')
  );

  const saveStory = () => {
    if (!generatedStory) return;
    
    const storyToSave = {
      ...generatedStory,
      savedAt: new Date().toISOString()
    };
    
    const newSavedStories = [...savedStories, storyToSave];
    setSavedStories(newSavedStories);
    localStorage.setItem('savedStories', JSON.stringify(newSavedStories));
    
    toast({
      title: "Story Saved",
      description: "Your story has been saved to your collection",
    });
  };

  if (!generatedStory) {
    return (
      <CardContent className="pt-6">
        <div className="text-center p-10 text-muted-foreground bg-muted/30 rounded-lg">
          <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-50" />
          <p>Generate a story first to read it here</p>
          <Button variant="link">
            <MessageSquare className="h-5 w-5 mr-2" />
            Generate Story
          </Button>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent className="pt-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-2xl font-mythical text-primary">{generatedStory.title}</h3>
          <div className="flex gap-2">
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
          <Badge>{generatedStory.storyPrompt?.mythology} Mythology</Badge>
          {generatedStory.storyPrompt?.theme && <Badge variant="outline">{generatedStory.storyPrompt.theme}</Badge>}
          {generatedStory.storyPrompt?.character && <Badge variant="secondary">{generatedStory.storyPrompt.character}</Badge>}
        </div>

        <VoiceControls 
          story={generatedStory} 
          showArcsView={showArcsView}
        />

        <ImageGenerator
          story={generatedStory}
          generatedImage={generatedImage}
          customImagePrompt={customImagePrompt}
          setCustomImagePrompt={setCustomImagePrompt}
          setGeneratedImage={setGeneratedImage}
        />

        <StoryContent 
          story={generatedStory}
          showArcsView={showArcsView}
          setShowArcsView={setShowArcsView}
        />
      </motion.div>
    </CardContent>
  );
};

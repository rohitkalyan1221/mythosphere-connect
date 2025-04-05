
import React, { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, BookX, Bookmark, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { StoryResponse } from "@/lib/gemini";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { VoiceControls } from "./VoiceControls";
import { ImageGenerator } from "./ImageGenerator";
import { StoryContent } from "./StoryContent";

interface SavedStoriesListProps {
  selectedSavedStory: StoryResponse | null;
  setSelectedSavedStory: React.Dispatch<React.SetStateAction<StoryResponse | null>>;
  generatedImage: string | null;
  customImagePrompt: string;
  setGeneratedImage: React.Dispatch<React.SetStateAction<string | null>>;
  setCustomImagePrompt: React.Dispatch<React.SetStateAction<string>>;
}

export const SavedStoriesList: React.FC<SavedStoriesListProps> = ({
  selectedSavedStory,
  setSelectedSavedStory,
  generatedImage,
  customImagePrompt,
  setGeneratedImage,
  setCustomImagePrompt
}) => {
  const [savedStories, setSavedStories] = useState<StoryResponse[]>([]);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
  const [showArcsView, setShowArcsView] = useState<boolean>(true);

  useEffect(() => {
    const stories = JSON.parse(localStorage.getItem('savedStories') || '[]');
    setSavedStories(stories);
  }, []);

  const loadSavedStory = (story: StoryResponse) => {
    setSelectedSavedStory(story);
    setGeneratedImage(null);
    setCustomImagePrompt("");
    
    toast({
      title: "Story Loaded",
      description: `"${story.title}" has been loaded`,
    });
  };

  const deleteSavedStory = (index: number) => {
    const newSavedStories = [...savedStories];
    newSavedStories.splice(index, 1);
    setSavedStories(newSavedStories);
    localStorage.setItem('savedStories', JSON.stringify(newSavedStories));
    
    if (selectedSavedStory === savedStories[index]) {
      setSelectedSavedStory(null);
    }
    
    setConfirmDeleteIndex(null);
    
    toast({
      title: "Story Deleted",
      description: "The story has been removed from your collection",
    });
  };

  if (savedStories.length === 0) {
    return (
      <CardContent className="pt-6">
        <div className="text-center p-10 text-muted-foreground bg-muted/30 rounded-lg">
          <Bookmark className="h-10 w-10 mx-auto mb-4 opacity-50" />
          <p>You don't have any saved stories yet</p>
          <Button variant="link">
            <Bookmark className="h-5 w-5 mr-2" />
            Create Your First Story
          </Button>
        </div>
      </CardContent>
    );
  }

  if (!selectedSavedStory) {
    return (
      <CardContent className="pt-6">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            Your Saved Stories
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            {savedStories.map((story, index) => (
              <div 
                key={index}
                className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-primary/10 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{story.title}</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {story.storyPrompt?.mythology && (
                      <Badge variant="outline">{story.storyPrompt.mythology} Mythology</Badge>
                    )}
                    {story.storyPrompt?.theme && (
                      <Badge variant="secondary" className="text-xs">{story.storyPrompt.theme}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Saved: {new Date(story.savedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSavedStory(story)}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Read
                  </Button>
                  
                  <Dialog open={confirmDeleteIndex === index} onOpenChange={(open) => !open && setConfirmDeleteIndex(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive border-destructive/20 hover:bg-destructive/10"
                        onClick={() => setConfirmDeleteIndex(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Story</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete "{story.title}"? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                          variant="outline"
                          onClick={() => setConfirmDeleteIndex(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteSavedStory(index)}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
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
          <h3 className="text-2xl font-mythical text-primary">{selectedSavedStory.title}</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedSavedStory(null)}
            >
              <BookX className="h-4 w-4 mr-1" />
              Back to List
            </Button>
          </div>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-4 flex flex-wrap gap-2">
          {selectedSavedStory.storyPrompt?.mythology && (
            <Badge>{selectedSavedStory.storyPrompt.mythology} Mythology</Badge>
          )}
          {selectedSavedStory.storyPrompt?.theme && (
            <Badge variant="outline">{selectedSavedStory.storyPrompt.theme}</Badge>
          )}
          {selectedSavedStory.storyPrompt?.character && (
            <Badge variant="secondary">{selectedSavedStory.storyPrompt.character}</Badge>
          )}
        </div>

        <VoiceControls 
          story={selectedSavedStory} 
          showArcsView={showArcsView}
        />

        <ImageGenerator
          story={selectedSavedStory}
          generatedImage={generatedImage}
          customImagePrompt={customImagePrompt}
          setCustomImagePrompt={setCustomImagePrompt}
          setGeneratedImage={setGeneratedImage}
        />

        <StoryContent 
          story={selectedSavedStory}
          showArcsView={showArcsView}
          setShowArcsView={setShowArcsView}
        />
      </motion.div>
    </CardContent>
  );
};

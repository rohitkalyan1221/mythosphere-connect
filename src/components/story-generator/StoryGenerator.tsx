
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, BookOpen, Bookmark } from "lucide-react";
import { StoryResponse } from "@/lib/gemini";
import { StoryForm } from "./StoryForm";
import { StoryReader } from "./StoryReader";
import { SavedStoriesList } from "./SavedStoriesList";

const StoryGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("create");
  const [generatedStory, setGeneratedStory] = useState<StoryResponse | null>(null);
  const [selectedSavedStory, setSelectedSavedStory] = useState<StoryResponse | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [customImagePrompt, setCustomImagePrompt] = useState<string>("");
  
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
        <TabsList className="grid grid-cols-3 mx-6 my-2">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Create Story
          </TabsTrigger>
          <TabsTrigger value="read" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Read Story
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Saved Stories
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="p-0">
          <StoryForm 
            setGeneratedStory={setGeneratedStory} 
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="read" className="p-0">
          <StoryReader 
            generatedStory={generatedStory}
            setGeneratedImage={setGeneratedImage}
            generatedImage={generatedImage}
            customImagePrompt={customImagePrompt}
            setCustomImagePrompt={setCustomImagePrompt}
          />
        </TabsContent>
        
        <TabsContent value="saved" className="p-0">
          <SavedStoriesList 
            selectedSavedStory={selectedSavedStory}
            setSelectedSavedStory={setSelectedSavedStory}
            setGeneratedImage={setGeneratedImage}
            generatedImage={generatedImage}
            customImagePrompt={customImagePrompt}
            setCustomImagePrompt={setCustomImagePrompt}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default StoryGenerator;

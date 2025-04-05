
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StoryResponse } from "@/lib/gemini";

interface StoryContentProps {
  story: StoryResponse;
  showArcsView: boolean;
  setShowArcsView: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StoryContent: React.FC<StoryContentProps> = ({ 
  story, 
  showArcsView, 
  setShowArcsView 
}) => {
  const renderStoryContent = () => {
    if (!story) return null;

    if (showArcsView && story.storyArcs && story.storyArcs.length > 0) {
      return (
        <Accordion type="single" collapsible className="w-full">
          {story.storyArcs.map((arc, index) => (
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
        {story.story.split('\n\n').map((paragraph, i) => (
          <p key={i} className="mb-4">{paragraph}</p>
        ))}
      </div>
    );
  };

  return (
    <>
      {story.storyArcs && story.storyArcs.length > 0 && (
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
    </>
  );
};

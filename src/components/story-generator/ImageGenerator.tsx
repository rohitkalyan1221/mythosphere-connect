
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { generateImage } from "@/lib/stability";
import { StoryResponse } from "@/lib/gemini";
import { toast } from "@/hooks/use-toast";

const DEFAULT_STABILITY_KEY = "sk-xqnIAFadjtu4CGLww0ZG0wII3DfZ6VCwVWAWxU8oRFYsyR2A";

interface ImageGeneratorProps {
  story: StoryResponse;
  generatedImage: string | null;
  customImagePrompt: string;
  setCustomImagePrompt: React.Dispatch<React.SetStateAction<string>>;
  setGeneratedImage: React.Dispatch<React.SetStateAction<string | null>>;
  useCustomStabilityKey?: boolean;
  stabilityApiKey?: string;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  story,
  generatedImage,
  customImagePrompt,
  setCustomImagePrompt,
  setGeneratedImage,
  useCustomStabilityKey = false,
  stabilityApiKey = DEFAULT_STABILITY_KEY
}) => {
  const [imageLoading, setImageLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!story) {
      toast({
        title: "No Story Found",
        description: "Please generate or select a story first before creating an image",
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
        : `${story.title}, ${story.storyPrompt?.mythology} mythology, epic scene, dramatic lighting, detailed illustration`;
      
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

  if (generatedImage) {
    return (
      <div className="relative rounded-md overflow-hidden aspect-[16/9] mb-6 shadow-lg">
        <img 
          src={generatedImage} 
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-sm text-white font-medium">
            Scene from "{story.title}"
          </p>
        </div>
      </div>
    );
  }

  return (
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
  );
};

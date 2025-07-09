
import { toast } from "@/components/ui/use-toast";

const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

export type StoryPrompt = {
  mythology: string;
  character?: string;
  theme?: string;
  length?: "short" | "medium" | "long";
};

export type StoryArc = {
  title: string;
  content: string;
};

export type StoryResponse = {
  story: string;
  title: string;
  storyArcs?: StoryArc[];
  error?: string;
  storyPrompt?: StoryPrompt;  // Added this property
  savedAt?: string;           // Added this property
};

export async function generateStory(
  apiKey: string,
  prompt: StoryPrompt
): Promise<StoryResponse> {
  try {
    // Use Supabase edge function instead of direct Gemini API
    const response = await fetch('/functions/v1/generate-story', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error generating story");
    }

    const data = await response.json();
    return {
      title: data.title,
      story: data.story,
      storyArcs: data.storyArcs || [],
      storyPrompt: prompt
    };
  } catch (error) {
    console.error("Error generating story:", error);
    toast({
      title: "Story Generation Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return {
      title: "",
      story: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
      storyPrompt: prompt
    };
  }
}

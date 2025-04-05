
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
    if (!apiKey) {
      throw new Error("API key is required");
    }
    
    // Enhanced prompt requesting structured story with arcs
    const mythologyPrompt = `Create a ${prompt.length || "medium"} mythological story from ${
      prompt.mythology
    } mythology${prompt.character ? ` featuring ${prompt.character}` : ""}${
      prompt.theme ? ` with themes of ${prompt.theme}` : ""
    }. 
    
    Format the response as a JSON object with the following fields:
    - 'title': a compelling title for the story
    - 'story': the complete narrative text
    - 'storyArcs': an array of story sections/arcs, where each arc has a 'title' and 'content' field
    
    Divide the story into 3-5 meaningful arcs or chapters. Keep the tone authentic to the cultural context.`;
    
    const response = await fetch(
      `${API_URL}?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: mythologyPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error generating story");
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const storyData = JSON.parse(jsonMatch[0]);
        return {
          title: storyData.title || "Untitled Story",
          story: storyData.story || text,
          storyArcs: storyData.storyArcs || [],
          storyPrompt: prompt  // Include the original prompt in the response
        };
      } else {
        // Fallback if no JSON is found
        return {
          title: "Mythological Tale",
          story: text,
          storyPrompt: prompt  // Include the original prompt in the response
        };
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini response:", parseError);
      return {
        title: "Mythological Tale",
        story: text,
        storyPrompt: prompt  // Include the original prompt in the response
      };
    }
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
      storyPrompt: prompt  // Include the original prompt in the response
    };
  }
}

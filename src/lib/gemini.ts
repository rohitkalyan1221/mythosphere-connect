
import { toast } from "@/components/ui/use-toast";

const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

export type StoryPrompt = {
  mythology: string;
  character?: string;
  theme?: string;
  length?: "short" | "medium" | "long";
};

export type StoryResponse = {
  story: string;
  title: string;
  error?: string;
};

export async function generateStory(
  apiKey: string,
  prompt: StoryPrompt
): Promise<StoryResponse> {
  try {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    
    const mythologyPrompt = `Create a ${prompt.length || "medium"} mythological story from ${
      prompt.mythology
    } mythology${prompt.character ? ` featuring ${prompt.character}` : ""}${
      prompt.theme ? ` with themes of ${prompt.theme}` : ""
    }. Format the response as a JSON object with 'title' and 'story' fields. Keep the tone authentic to the cultural context.`;
    
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
        };
      } else {
        // Fallback if no JSON is found
        return {
          title: "Mythological Tale",
          story: text,
        };
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini response:", parseError);
      return {
        title: "Mythological Tale",
        story: text,
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
    };
  }
}

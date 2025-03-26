
import { toast } from "@/components/ui/use-toast";

const PIXLR_API_URL = "https://api.pixlr.com/generator/v1";
const DEFAULT_PIXLR_KEY = "92b0e3fac21b463682ec42c523173401";

export type ImageGenerationParams = {
  prompt: string;
  apiKey?: string;
  width?: number;
  height?: number;
};

export interface PixlrResponse {
  url?: string;
  error?: string;
}

export async function generateImage(params: ImageGenerationParams): Promise<PixlrResponse> {
  try {
    const { prompt, apiKey = DEFAULT_PIXLR_KEY, width = 1024, height = 1024 } = params;
    
    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (!prompt || prompt.trim() === "") {
      throw new Error("Image prompt is required");
    }

    // Enhance the prompt with aesthetic details if the prompt is very short
    const enhancedPrompt = prompt.length < 15 
      ? `${prompt}, detailed illustration, epic scene, dramatic lighting, mythological style` 
      : prompt;

    console.log("Sending request to Pixlr API with:", {
      prompt: enhancedPrompt,
      apiKey: apiKey.substring(0, 5) + "...", // Log partial key for security
      width,
      height
    });

    const response = await fetch(`${PIXLR_API_URL}/text2image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        width,
        height,
        num_outputs: 1,
      }),
    });

    console.log("Pixlr API response status:", response.status);
    
    const responseData = await response.json();
    console.log("Pixlr API response data:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || "Error generating image");
    }
    
    // Extract image URL from the response
    if (responseData.results && responseData.results.length > 0) {
      return { url: responseData.results[0].image_url };
    } else {
      throw new Error("No image was generated in the response");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    toast({
      title: "Image Generation Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

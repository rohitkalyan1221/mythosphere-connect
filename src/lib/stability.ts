import { toast } from "@/components/ui/use-toast";

const STABILITY_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";
const DEFAULT_STABILITY_KEY = "sk-Uy7gMY5fbl3jv2UwIe8LNwh20ApGB9tOfEhSQhRxDellbUmq";

export type ImageGenerationParams = {
  prompt: string;
  apiKey?: string;
  width?: number;
  height?: number;
  samples?: number;
};

export interface StabilityResponse {
  url?: string;
  error?: string;
}

export async function generateImage(params: ImageGenerationParams): Promise<StabilityResponse> {
  try {
    const { 
      prompt, 
      apiKey = DEFAULT_STABILITY_KEY, 
      width = 1024, 
      height = 1024,
      samples = 1
    } = params;
    
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

    console.log("Sending request to Stability AI API with:", {
      prompt: enhancedPrompt,
      apiKey: apiKey.substring(0, 5) + "...", // Log partial key for security
      width,
      height,
      samples
    });

    const response = await fetch(STABILITY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: enhancedPrompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height,
        width,
        samples,
        steps: 30,
      }),
    });

    console.log("Stability AI API response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Stability API error:", errorData);
      throw new Error(errorData.message || "Error generating image");
    }
    
    const responseData = await response.json();
    console.log("Stability AI response data:", responseData);

    // Extract image URL from the response
    if (responseData.artifacts && responseData.artifacts.length > 0) {
      // Convert base64 to URL
      const base64Image = responseData.artifacts[0].base64;
      const imageUrl = `data:image/png;base64,${base64Image}`;
      return { url: imageUrl };
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

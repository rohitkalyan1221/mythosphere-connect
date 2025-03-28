
import { toast } from "@/components/ui/use-toast";

const MESHY_API_URL = "https://api.meshy.ai/v2/text-to-3d";
const DEFAULT_MESHY_KEY = "msy_A95tIfxXvNXtSTzQ0b7hBCNbL8psuei8ZeVm";

export type ModelGenerationParams = {
  prompt: string;
  apiKey?: string;
  style?: string;
  negative_prompt?: string;
};

export interface MeshyResponse {
  modelUrl?: string;
  glbUrl?: string;
  thumbnailUrl?: string;
  taskId?: string;
  error?: string;
  status?: string;
}

export async function generateModel(params: ModelGenerationParams): Promise<MeshyResponse> {
  try {
    const { 
      prompt, 
      apiKey = DEFAULT_MESHY_KEY, 
      style = "realistic", 
      negative_prompt = "blurry, distorted, low quality" 
    } = params;
    
    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (!prompt || prompt.trim() === "") {
      throw new Error("Character prompt is required");
    }

    console.log("Sending request to Meshy AI API with:", {
      prompt,
      apiKey: apiKey.substring(0, 5) + "...", // Log partial key for security
      style
    });

    const response = await fetch(MESHY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        style,
        negative_prompt,
        webhook_event_url: null // Ensure this is null or omit to avoid webhook errors
      }),
    });

    console.log("Meshy AI API response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Meshy API error:", errorData);
      throw new Error(errorData.message || errorData.error || "Error generating 3D model");
    }
    
    const responseData = await response.json();
    console.log("Meshy AI response data:", responseData);

    // Initial response contains a task ID which we need to poll for the result
    if (responseData.id) {
      return { taskId: responseData.id, status: responseData.status };
    } else {
      throw new Error("No task ID was returned");
    }
  } catch (error) {
    console.error("Error generating 3D model:", error);
    toast({
      title: "3D Model Generation Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive",
    });
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function checkModelStatus(taskId: string, apiKey: string = DEFAULT_MESHY_KEY): Promise<MeshyResponse> {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }
    
    console.log(`Checking status for Meshy task: ${taskId}`);
    
    const response = await fetch(`https://api.meshy.ai/v2/text-to-3d/${taskId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Meshy API status check error:", errorData);
      throw new Error(errorData.message || errorData.error || "Error checking 3D model status");
    }

    const responseData = await response.json();
    console.log("Meshy AI status check response:", responseData);

    if (responseData.status === "completed" || responseData.status === "succeeded") {
      return {
        modelUrl: responseData.viewer_url || responseData.output?.viewer_url,
        glbUrl: responseData.output?.glb,
        thumbnailUrl: responseData.output?.thumbnail,
        status: responseData.status
      };
    } else if (responseData.status === "failed") {
      throw new Error("Model generation failed: " + (responseData.error || "Unknown error"));
    } else {
      // Still processing
      return { 
        taskId,
        status: responseData.status 
      };
    }
  } catch (error) {
    console.error("Error checking model status:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: "error"
    };
  }
}

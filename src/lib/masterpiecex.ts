
import { toast } from "@/components/ui/use-toast";

const MASTERPIECEX_API_URL = "https://api.masterpiecex.com/v1/image";
const DEFAULT_MASTERPIECEX_KEY = "zpka_0414d521d54244b5bd60b60dfcc86048_3ee5e5be";

export type Model3DGenerationParams = {
  prompt: string;
  apiKey?: string;
  style?: string;
  negative_prompt?: string;
};

export interface Model3DResponse {
  modelUrl?: string;
  glbUrl?: string;
  thumbnailUrl?: string;
  taskId?: string;
  error?: string;
  status?: string;
}

export async function generateModel(params: Model3DGenerationParams): Promise<Model3DResponse> {
  try {
    const { 
      prompt, 
      apiKey = DEFAULT_MASTERPIECEX_KEY, 
      style = "realistic", 
      negative_prompt = "blurry, distorted, low quality" 
    } = params;
    
    if (!apiKey) {
      throw new Error("API key is required");
    }

    if (!prompt || prompt.trim() === "") {
      throw new Error("Character prompt is required");
    }

    console.log("Sending request to MasterpieceX AI API with:", {
      prompt,
      apiKey: apiKey.substring(0, 5) + "...",
      style
    });

    const response = await fetch(MASTERPIECEX_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        negative_prompt,
        model: "masterpiece-3d-v1.0",
      }),
    });

    console.log("MasterpieceX AI API response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Error generating 3D model";
      
      try {
        // Try to parse as JSON to get more details
        const errorData = JSON.parse(errorText);
        console.error("MasterpieceX API error response:", errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        // If not valid JSON, log the raw text
        console.error("MasterpieceX API error (non-JSON):", errorText);
      }
      
      throw new Error(errorMessage);
    }
    
    const responseData = await response.json();
    console.log("MasterpieceX AI response data:", responseData);

    // Initial response contains a task ID which we need to poll for the result
    if (responseData.id) {
      return { 
        taskId: responseData.id, 
        status: responseData.status || "processing" 
      };
    } else {
      throw new Error("No task ID was returned from MasterpieceX API");
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
      status: "error"
    };
  }
}

export async function checkModelStatus(taskId: string, apiKey: string = DEFAULT_MASTERPIECEX_KEY): Promise<Model3DResponse> {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }
    
    console.log(`Checking status for MasterpieceX task: ${taskId}`);
    
    const response = await fetch(`${MASTERPIECEX_API_URL}/${taskId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
    });

    console.log("MasterpieceX AI status check response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = "Error checking 3D model status";
      
      try {
        // Try to parse as JSON to get more details
        const errorData = JSON.parse(errorText);
        console.error("MasterpieceX API status check error:", errorData);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (jsonError) {
        // If not valid JSON, log the raw text
        console.error("MasterpieceX API status check error (non-JSON):", errorText);
      }
      
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log("MasterpieceX AI status check response data:", responseData);

    if (responseData.status === "completed" || responseData.status === "succeeded") {
      // For the newer API version, output is nested inside the output property
      const output = responseData.output || responseData;
      
      return {
        modelUrl: output.viewer_url || output.html_url,
        glbUrl: output.glb_url || output.download_url,
        thumbnailUrl: output.thumbnail || output.image_url,
        status: responseData.status
      };
    } else if (responseData.status === "failed") {
      const errorMessage = responseData.error || "Model generation failed without specific error";
      throw new Error("Model generation failed: " + errorMessage);
    } else {
      // Still processing
      return { 
        taskId,
        status: responseData.status || "processing"
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

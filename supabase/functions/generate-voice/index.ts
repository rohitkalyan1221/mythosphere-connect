
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Set your ElevenLabs API key
const ELEVEN_LABS_API_KEY = "sk_e50f28a3a5ea815ef6ae3efde098d9013f49c7851deb217e";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId, modelId } = await req.json();
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text content is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use default values if not provided
    const voice = voiceId || "EXAVITQu4vr4xnSDxMaL"; // Sarah voice
    const model = modelId || "eleven_turbo_v2";
    
    console.log(`Generating voice with ElevenLabs API for text: ${text.substring(0, 50)}...`);
    console.log(`Using voice ID: ${voice}, model: ${model}`);

    // Call ElevenLabs API to generate audio using hardcoded API key
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("ElevenLabs API error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate audio", 
          details: errorData 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get the audio data as an ArrayBuffer
    const audioArrayBuffer = await response.arrayBuffer();
    
    // Convert to base64 for safe transmission
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioArrayBuffer))
    );

    console.log("Voice generation successful, returning audio content");

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        format: "mp3"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error("Error in voice generation:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

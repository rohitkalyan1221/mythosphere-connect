import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { storyPrompt } = await req.json();
    const { mythology, character, theme, length } = storyPrompt;

    const mythologyPrompt = `Create a ${length || "medium"} mythological story from ${
      mythology
    } mythology${character ? ` featuring ${character}` : ""}${
      theme ? ` with themes of ${theme}` : ""
    }. 
    
    Format the response as a JSON object with the following fields:
    - 'title': a compelling title for the story
    - 'story': the complete narrative text
    - 'storyArcs': an array of story sections/arcs, where each arc has a 'title' and 'content' field
    
    Divide the story into 3-5 meaningful arcs or chapters. Keep the tone authentic to the cultural context.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`,
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
      if (response.status === 429) {
        throw new Error("API quota exceeded. The Gemini API has reached its limit. Please try again later or upgrade your API plan.");
      }
      throw new Error(error.error?.message || error.message || "Error generating story");
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const storyData = JSON.parse(jsonMatch[0]);
        return new Response(JSON.stringify({
          title: storyData.title || "Untitled Story",
          story: storyData.story || text,
          storyArcs: storyData.storyArcs || [],
          storyPrompt
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({
          title: "Mythological Tale",
          story: text,
          storyPrompt
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from Gemini response:", parseError);
      return new Response(JSON.stringify({
        title: "Mythological Tale",
        story: text,
        storyPrompt
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("Error generating story:", error);
    return new Response(JSON.stringify({
      error: error.message || "Unknown error occurred"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mythology, character, theme, length } = await req.json();
    
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const prompt = `Create a ${length || "medium"} mythological story from ${mythology} mythology${character ? ` featuring ${character}` : ""}${theme ? ` with themes of ${theme}` : ""}. 
    
    Format the response as a JSON object with the following fields:
    - 'title': a compelling title for the story
    - 'story': the complete narrative text
    - 'storyArcs': an array of story sections/arcs, where each arc has a 'title' and 'content' field
    
    Divide the story into 3-5 meaningful arcs or chapters. Keep the tone authentic to the cultural context.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate story');
    }

    const data = await response.json();
    const text = data.content[0].text;
    
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const storyData = JSON.parse(jsonMatch[0]);
        return new Response(JSON.stringify({
          title: storyData.title || "Untitled Story",
          story: storyData.story || text,
          storyArcs: storyData.storyArcs || [],
          storyPrompt: { mythology, character, theme, length }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } else {
        // Fallback if no JSON is found
        return new Response(JSON.stringify({
          title: "Mythological Tale",
          story: text,
          storyPrompt: { mythology, character, theme, length }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from Claude response:", parseError);
      return new Response(JSON.stringify({
        title: "Mythological Tale",
        story: text,
        storyPrompt: { mythology, character, theme, length }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in generate-story function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      title: "",
      story: ""
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
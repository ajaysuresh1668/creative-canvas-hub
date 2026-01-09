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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { action, prompt, frameBase64 } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'enhance':
        systemPrompt = 'You are an AI video enhancement assistant. Analyze frames and provide specific filter recommendations.';
        userPrompt = `Analyze this video frame and provide JSON recommendations for enhancing the video. Return ONLY valid JSON with these numeric values:
{
  "brightness": number (0-200),
  "contrast": number (0-200), 
  "saturation": number (0-200),
  "hue": number (0-360),
  "sepia": number (0-100),
  "description": "Brief description of enhancements"
}`;
        break;
      
      case 'color_grade':
        systemPrompt = 'You are an AI color grading specialist for video content.';
        userPrompt = `Based on the style "${prompt || 'cinematic'}", provide professional color grading settings. Return ONLY valid JSON:
{
  "brightness": number (0-200),
  "contrast": number (0-200),
  "saturation": number (0-200),
  "hue": number (0-360),
  "sepia": number (0-100),
  "grayscale": number (0-100),
  "description": "Brief description of the color grade"
}`;
        break;

      case 'scene_analysis':
        systemPrompt = 'You are an AI video scene analyzer.';
        userPrompt = `Analyze this video frame and describe the scene. Suggest optimal filter settings for this type of content. Return ONLY valid JSON:
{
  "scene_type": "string (e.g., outdoor, indoor, portrait, action, landscape)",
  "lighting": "string (e.g., natural, artificial, low-light, bright)",
  "mood": "string",
  "brightness": number,
  "contrast": number,
  "saturation": number,
  "hue": number,
  "recommended_style": "string",
  "description": "Detailed scene analysis"
}`;
        break;

      case 'auto_correct':
        systemPrompt = 'You are an AI video color correction specialist.';
        userPrompt = `Analyze this video frame and suggest automatic color correction. Return ONLY valid JSON:
{
  "brightness": number,
  "contrast": number,
  "saturation": number,
  "hue": number,
  "description": "What was corrected"
}`;
        break;

      case 'style_transfer':
        systemPrompt = 'You are an AI that applies cinematic styles to video.';
        userPrompt = `Apply a "${prompt || 'Hollywood blockbuster'}" style to this video. Return ONLY valid JSON:
{
  "brightness": number,
  "contrast": number,
  "saturation": number,
  "hue": number,
  "sepia": number,
  "grayscale": number,
  "style_name": "string",
  "description": "How this style transforms the video"
}`;
        break;

      case 'generate_thumbnail':
        systemPrompt = 'You are an AI that suggests optimal video thumbnail settings.';
        userPrompt = `Analyze this frame and suggest settings to make it an eye-catching thumbnail. Return ONLY valid JSON:
{
  "brightness": number,
  "contrast": number,
  "saturation": number,
  "vibrancy_boost": number (0-50),
  "description": "Why these settings work for a thumbnail"
}`;
        break;

      default:
        systemPrompt = 'You are an AI video editing assistant.';
        userPrompt = prompt || 'Provide general video enhancement recommendations.';
    }

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (frameBase64 && ['enhance', 'scene_analysis', 'auto_correct', 'style_transfer', 'generate_thumbnail'].includes(action)) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          { 
            type: 'image_url', 
            image_url: { 
              url: frameBase64.startsWith('data:') ? frameBase64 : `data:image/jpeg;base64,${frameBase64}` 
            } 
          }
        ]
      });
    } else {
      messages.push({ role: 'user', content: userPrompt });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Usage limit reached. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Try to parse JSON from the response
    let parsedResult = null;
    try {
      // Extract JSON from the response if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      parsedResult = JSON.parse(jsonString.trim());
    } catch {
      // If parsing fails, return the raw content
      parsedResult = { description: content, raw: true };
    }

    return new Response(JSON.stringify({ 
      success: true, 
      result: parsedResult,
      action 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI video enhance error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

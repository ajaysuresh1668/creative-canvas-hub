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

    const { action, imageBase64, prompt } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'enhance':
        systemPrompt = 'You are an AI image enhancement assistant. Analyze the image and provide specific adjustment recommendations.';
        userPrompt = `Analyze this image and provide JSON recommendations for enhancing it. Return ONLY valid JSON with these numeric values (0-200 for percentages, 0-360 for hue):
{
  "brightness": number,
  "contrast": number, 
  "saturation": number,
  "hue": number,
  "sepia": number,
  "warmth": number,
  "description": "Brief description of enhancements"
}`;
        break;
      
      case 'style_transfer':
        systemPrompt = 'You are an AI that suggests artistic filter settings based on style descriptions.';
        userPrompt = `Based on the style "${prompt || 'cinematic'}", provide JSON filter settings. Return ONLY valid JSON:
{
  "brightness": number (0-200),
  "contrast": number (0-200),
  "saturation": number (0-200),
  "hue": number (0-360),
  "sepia": number (0-100),
  "grayscale": number (0-100),
  "description": "Brief description of the style"
}`;
        break;

      case 'color_correction':
        systemPrompt = 'You are an AI color correction specialist.';
        userPrompt = `Analyze this image and suggest color correction settings. Return ONLY valid JSON:
{
  "brightness": number,
  "contrast": number,
  "saturation": number,
  "hue": number,
  "warmth": number,
  "description": "What was corrected"
}`;
        break;

      case 'portrait_enhance':
        systemPrompt = 'You are an AI portrait enhancement specialist.';
        userPrompt = `Suggest optimal portrait enhancement settings. Return ONLY valid JSON:
{
  "smoothness": number (0-100),
  "glow": number (0-100),
  "warmth": number (0-100),
  "brightness": number (0-200),
  "contrast": number (0-200),
  "saturation": number (0-200),
  "description": "Portrait enhancements applied"
}`;
        break;

      case 'generate_prompt':
        systemPrompt = 'You are an AI that generates creative image editing suggestions.';
        userPrompt = prompt || 'Suggest 5 creative image editing ideas with specific filter settings for each.';
        break;

      default:
        systemPrompt = 'You are an AI image editing assistant.';
        userPrompt = prompt || 'Provide general image enhancement recommendations.';
    }

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (imageBase64 && action !== 'style_transfer' && action !== 'generate_prompt') {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userPrompt },
          { 
            type: 'image_url', 
            image_url: { 
              url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` 
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
    console.error('AI enhance error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, disasterType } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided", isLegitimate: false }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured", isLegitimate: false }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a disaster verification expert for the Indian Disaster Response System. Your job is to analyze images submitted with disaster reports and determine if they show a legitimate emergency situation.

IMPORTANT: Lives depend on accurate assessment. Be thorough but also understand that during emergencies, image quality may be poor.

Analyze the image for:
1. Does it show signs of a disaster or emergency (flooding, fire, collapsed structures, accidents, etc.)?
2. Does the image appear to be a real photograph (not AI-generated, stock photo, or screenshot from movies/games)?
3. Is the image relevant to the reported disaster type: "${disasterType || 'unspecified'}"?

Respond ONLY with a JSON object in this exact format:
{
  "isLegitimate": true/false,
  "confidence": "high"/"medium"/"low",
  "reason": "Brief explanation in 1-2 sentences",
  "warnings": ["any concerns or notes"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this disaster report image and verify if it shows a legitimate emergency situation.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service busy, please try again", isLegitimate: false }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Verification service unavailable", isLegitimate: false }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    console.log("AI Response:", content);

    // Parse the JSON response from AI
    let verificationResult;
    try {
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        verificationResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Default to allowing submission if AI response is unclear (to not block real emergencies)
      verificationResult = {
        isLegitimate: true,
        confidence: "low",
        reason: "Unable to fully verify image, proceeding with caution",
        warnings: ["Manual verification recommended"],
      };
    }

    return new Response(JSON.stringify(verificationResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in verify-disaster-image:", error);
    const errorMessage = error instanceof Error ? error.message : "Verification failed";
    return new Response(
      JSON.stringify({ 
        error: errorMessage, 
        isLegitimate: false 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

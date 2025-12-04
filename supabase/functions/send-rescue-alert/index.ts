import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AlertRequest {
  phoneNumber: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, message }: AlertRequest = await req.json();

    console.log(`Sending alert to: ${phoneNumber}`);
    console.log(`Message: ${message}`);

    if (!phoneNumber || !message) {
      throw new Error("Phone number and message are required");
    }

    // Get Fast2SMS API key from environment
    const apiKey = Deno.env.get("FAST2SMS_API_KEY");
    
    if (!apiKey) {
      console.error("FAST2SMS_API_KEY not configured");
      throw new Error("SMS service not configured. Please add FAST2SMS_API_KEY.");
    }

    // Fast2SMS API call
    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q", // Quick SMS route
        message: message,
        language: "english",
        flash: 0,
        numbers: phoneNumber,
      }),
    });

    const result = await response.json();
    console.log("Fast2SMS Response:", JSON.stringify(result));

    if (!result.return) {
      throw new Error(result.message || "Failed to send SMS");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Alert sent successfully",
        requestId: result.request_id 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error("Error sending alert:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send alert" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
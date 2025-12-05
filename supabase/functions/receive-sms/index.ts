import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received incoming SMS webhook");

    // Parse Twilio webhook data (form-encoded)
    const formData = await req.formData();
    const from = formData.get("From") as string;
    const body = formData.get("Body") as string;
    const messageSid = formData.get("MessageSid") as string;

    console.log(`SMS from: ${from}, Body: ${body?.substring(0, 50)}...`);

    if (!body) {
      console.log("Empty message received");
      return new Response("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>", {
        headers: { "Content-Type": "text/xml", ...corsHeaders },
      });
    }

    // Parse the message - expected format: DISASTER TYPE|LOCATION|DESCRIPTION
    // Example: "FLOOD|Mumbai, Maharashtra|Water level rising, 50 people stranded"
    const parts = body.split("|").map(p => p.trim());
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const refId = `DR-SMS-${Date.now().toString(36).toUpperCase()}`;
    
    // Create disaster report from SMS
    const reportData = {
      type: parts[0]?.toLowerCase() || "unknown",
      severity: "high", // Default to high for SMS reports
      state: "Unknown",
      district: "Unknown",
      location: parts[1] || "Location not specified",
      description: parts[2] || body, // Use full message if not parsed
      source: "sms",
      victim_message: body,
      reporter_contact: from,
      reference_id: refId,
      status: "active",
    };

    console.log("Creating disaster report:", reportData);

    const { error: insertError } = await supabase
      .from("disaster_reports")
      .insert(reportData);

    if (insertError) {
      console.error("Failed to insert report:", insertError);
    } else {
      console.log("Disaster report created:", refId);

      // Send SMS alerts to all configured rescue numbers
      await sendRescueAlerts(reportData, refId);
    }

    // Respond with TwiML confirmation
    const twimlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Alert received. Reference: ${refId}. Help is on the way. For immediate emergency, call 112.</Message>
</Response>`;

    return new Response(twimlResponse, {
      headers: { "Content-Type": "text/xml", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error processing SMS:", error);
    return new Response("<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response></Response>", {
      headers: { "Content-Type": "text/xml", ...corsHeaders },
    });
  }
});

async function sendRescueAlerts(report: any, refId: string) {
  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
  
  // Get rescue numbers from environment or database
  const rescueNumbers = Deno.env.get("RESCUE_CREW_NUMBERS")?.split(",") || [];
  
  if (!accountSid || !authToken || !twilioNumber || rescueNumbers.length === 0) {
    console.log("Twilio not configured or no rescue numbers set");
    return;
  }

  const alertMessage = `🚨 DISASTER ALERT 🚨
Type: ${report.type.toUpperCase()}
Location: ${report.location}
From: ${report.reporter_contact || "Unknown"}
Message: ${report.victim_message?.substring(0, 100)}
Ref: ${refId}
- India Disaster Response`;

  const credentials = btoa(`${accountSid}:${authToken}`);

  for (const number of rescueNumbers) {
    const cleanNumber = number.trim();
    if (!cleanNumber) continue;

    try {
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: cleanNumber.startsWith("+") ? cleanNumber : `+91${cleanNumber}`,
            From: twilioNumber,
            Body: alertMessage,
          }),
        }
      );

      const result = await response.json();
      console.log(`Alert sent to ${cleanNumber}:`, result.sid || result.message);
    } catch (err) {
      console.error(`Failed to send to ${cleanNumber}:`, err);
    }
  }
}

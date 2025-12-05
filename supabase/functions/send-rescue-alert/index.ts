import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AlertRequest {
  phoneNumbers: string[]; // Support multiple numbers
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Support both old single number and new multiple numbers format
    const phoneNumbers: string[] = body.phoneNumbers || (body.phoneNumber ? [body.phoneNumber] : []);
    const message: string = body.message;

    console.log(`Sending alert to: ${phoneNumbers.join(", ")}`);
    console.log(`Message: ${message?.substring(0, 50)}...`);

    if (phoneNumbers.length === 0) {
      throw new Error("At least one phone number is required");
    }

    if (!message) {
      throw new Error("Message is required");
    }

    // Try Twilio first, fallback to Fast2SMS
    const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
    const fast2smsKey = Deno.env.get("FAST2SMS_API_KEY");

    let results: { number: string; success: boolean; error?: string }[] = [];

    if (twilioSid && twilioToken && twilioNumber) {
      // Use Twilio
      console.log("Using Twilio for SMS");
      const credentials = btoa(`${twilioSid}:${twilioToken}`);

      for (const phoneNumber of phoneNumbers) {
        const cleanNumber = phoneNumber.trim().replace(/\s/g, "");
        if (!cleanNumber) continue;

        const formattedNumber = cleanNumber.startsWith("+")
          ? cleanNumber
          : `+91${cleanNumber.replace(/^91/, "")}`;

        try {
          const response = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                To: formattedNumber,
                From: twilioNumber,
                Body: message,
              }),
            }
          );

          const result = await response.json();

          if (response.ok) {
            console.log(`SMS sent to ${formattedNumber}:`, result.sid);
            results.push({ number: formattedNumber, success: true });
          } else {
            console.error(`Failed for ${formattedNumber}:`, result);
            results.push({ number: formattedNumber, success: false, error: result.message });
          }
        } catch (err: any) {
          console.error(`Error for ${formattedNumber}:`, err);
          results.push({ number: formattedNumber, success: false, error: err.message });
        }
      }
    } else if (fast2smsKey) {
      // Use Fast2SMS (supports comma-separated numbers)
      console.log("Using Fast2SMS for SMS");
      const numbersString = phoneNumbers
        .map(n => n.replace(/\s/g, "").replace(/^\+91/, "").replace(/^91/, ""))
        .filter(n => n.length === 10)
        .join(",");

      if (!numbersString) {
        throw new Error("No valid phone numbers provided");
      }

      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: fast2smsKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "q",
          message: message,
          language: "english",
          flash: 0,
          numbers: numbersString,
        }),
      });

      const result = await response.json();
      console.log("Fast2SMS Response:", JSON.stringify(result));

      if (result.return) {
        results = phoneNumbers.map(n => ({ number: n, success: true }));
      } else {
        throw new Error(result.message || "Fast2SMS failed");
      }
    } else {
      throw new Error("SMS service not configured. Add Twilio or Fast2SMS credentials.");
    }

    const successCount = results.filter(r => r.success).length;

    return new Response(
      JSON.stringify({
        success: successCount > 0,
        sent: successCount,
        total: phoneNumbers.length,
        results,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: successCount > 0 ? 200 : 500,
      }
    );
  } catch (error: any) {
    console.error("Error sending alert:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send alert",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

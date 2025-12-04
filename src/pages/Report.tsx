import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  MapPin,
  Send,
  CheckCircle,
  Phone,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const disasterTypes = [
  "Flood",
  "Earthquake",
  "Cyclone",
  "Landslide",
  "Fire",
  "Building Collapse",
  "Road Accident",
  "Industrial Accident",
  "Drought",
  "Heatwave",
  "Other",
];

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];

const severityLevels = [
  { value: "low", label: "Low - Minor incident, limited impact" },
  { value: "medium", label: "Medium - Significant damage, some injuries" },
  { value: "high", label: "High - Severe damage, multiple casualties" },
  { value: "critical", label: "Critical - Mass casualty event" },
];

const Report = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    severity: "",
    state: "",
    district: "",
    location: "",
    description: "",
    reporterContact: "",
    rescueCrewNumber: "",
    peopleAffected: "",
  });

  const validateIndianMobile = (number: string): boolean => {
    // Remove spaces and check for valid Indian mobile format
    const cleaned = number.replace(/\s/g, "");
    // Indian mobile: 10 digits starting with 6-9, optionally with +91 or 91 prefix
    const pattern = /^(?:\+91|91)?[6-9]\d{9}$/;
    return pattern.test(cleaned);
  };

  const formatPhoneNumber = (number: string): string => {
    const cleaned = number.replace(/\s/g, "").replace(/^\+/, "");
    if (cleaned.startsWith("91") && cleaned.length === 12) {
      return cleaned;
    }
    if (cleaned.length === 10) {
      return "91" + cleaned;
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rescueCrewNumber) {
      toast({
        title: "Rescue Crew Number Required",
        description: "Please enter the mobile number of the rescue crew to alert.",
        variant: "destructive",
      });
      return;
    }

    if (!validateIndianMobile(formData.rescueCrewNumber)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid Indian mobile number (10 digits starting with 6-9).",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const refId = `DR-IND-${Date.now().toString(36).toUpperCase()}`;
      
      // Prepare the message
      const message = `🚨 DISASTER ALERT 🚨
Type: ${formData.type.toUpperCase()}
Severity: ${formData.severity.toUpperCase()}
Location: ${formData.location}, ${formData.district}, ${formData.state}
People Affected: ${formData.peopleAffected || "Unknown"}
Details: ${formData.description}
Reporter Contact: ${formData.reporterContact || "Not provided"}
Ref: ${refId}
- India Disaster Response System`;

      // Call the edge function to send SMS
      const { data, error } = await supabase.functions.invoke("send-rescue-alert", {
        body: {
          phoneNumber: formatPhoneNumber(formData.rescueCrewNumber),
          message: message,
        },
      });

      if (error) {
        throw error;
      }

      setReferenceId(refId);
      setSubmitted(true);
      toast({
        title: "Alert Sent Successfully",
        description: "Rescue crew has been notified via SMS.",
      });
    } catch (error: any) {
      console.error("Error sending alert:", error);
      toast({
        title: "Failed to Send Alert",
        description: error.message || "Please try again or call emergency services directly.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Alert Sent Successfully
            </h1>
            <p className="text-muted-foreground mb-4">
              SMS alert has been sent to the rescue crew at{" "}
              <span className="text-primary font-medium">{formData.rescueCrewNumber}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Reference ID: <span className="font-mono text-primary">{referenceId}</span>
            </p>
            <div className="space-y-4">
              <Button onClick={() => {
                setSubmitted(false);
                setFormData({
                  type: "",
                  severity: "",
                  state: "",
                  district: "",
                  location: "",
                  description: "",
                  reporterContact: "",
                  rescueCrewNumber: "",
                  peopleAffected: "",
                });
              }} variant="outline" size="lg">
                Submit Another Report
              </Button>
              <p className="text-xs text-muted-foreground">
                For immediate emergencies, call <span className="text-destructive font-bold">112</span>
              </p>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Report a Disaster
            </h1>
            <p className="text-muted-foreground">
              Alert rescue crews instantly via SMS. Provide accurate information 
              to help responders act quickly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rescue Crew Contact - Most Important */}
            <div className="card-gradient rounded-xl border-2 border-primary/50 bg-primary/5 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">SMS Alert Recipient</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rescueCrewNumber" className="text-base">
                  Rescue Crew Mobile Number *
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="rescueCrewNumber"
                    type="tel"
                    placeholder="Enter 10-digit mobile number (e.g., 9876543210)"
                    className="pl-10 text-lg"
                    value={formData.rescueCrewNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, rescueCrewNumber: e.target.value })
                    }
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Indian mobile number where the disaster alert SMS will be sent
                </p>
              </div>
            </div>

            <div className="card-gradient rounded-xl border border-border p-6 space-y-6">
              {/* Disaster Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Disaster Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select disaster type" />
                  </SelectTrigger>
                  <SelectContent>
                    {disasterTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) =>
                    setFormData({ ...formData, severity: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State/UT *</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    setFormData({ ...formData, state: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label htmlFor="district">District *</Label>
                <Input
                  id="district"
                  placeholder="Enter district name"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Specific Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Village/Town, Landmark, Address"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* People Affected */}
              <div className="space-y-2">
                <Label htmlFor="peopleAffected">Estimated People Affected</Label>
                <Input
                  id="peopleAffected"
                  type="number"
                  placeholder="Approximate number"
                  value={formData.peopleAffected}
                  onChange={(e) =>
                    setFormData({ ...formData, peopleAffected: e.target.value })
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Situation Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the situation in detail - what happened, current conditions, immediate needs..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              {/* Reporter Contact */}
              <div className="space-y-2">
                <Label htmlFor="reporterContact">Your Contact Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="reporterContact"
                    type="tel"
                    placeholder="Your mobile number for follow-up"
                    className="pl-10"
                    value={formData.reporterContact}
                    onChange={(e) =>
                      setFormData({ ...formData, reporterContact: e.target.value })
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Rescue teams may contact you for additional information
                </p>
              </div>
            </div>

            {/* Submit */}
            <Button 
              type="submit" 
              variant="hero" 
              size="xl" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Alert...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send SMS Alert to Rescue Crew
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              For immediate life-threatening emergencies, call{" "}
              <span className="text-destructive font-semibold">112</span> (National Emergency),{" "}
              <span className="text-destructive font-semibold">100</span> (Police),{" "}
              <span className="text-destructive font-semibold">101</span> (Fire),{" "}
              <span className="text-destructive font-semibold">102</span> (Ambulance)
            </p>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Report;
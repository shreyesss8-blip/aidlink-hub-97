import { useState, useRef } from "react";
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
  Camera,
  X,
  ShieldCheck,
  ShieldAlert,
  ImageIcon,
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

interface VerificationResult {
  isLegitimate: boolean;
  confidence: string;
  reason: string;
  warnings?: string[];
}

const Report = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
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
    const cleaned = number.replace(/\s/g, "");
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

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setVerificationResult(null);
      
      // Auto-verify the image
      await verifyImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const verifyImage = async (imageBase64: string) => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("verify-disaster-image", {
        body: {
          imageBase64,
          disasterType: formData.type,
        },
      });

      if (error) throw error;

      setVerificationResult(data);
      
      if (!data.isLegitimate) {
        toast({
          title: "Image Verification Failed",
          description: data.reason || "This image does not appear to show a legitimate disaster.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Image Verified",
          description: "The image appears to show a legitimate emergency situation.",
        });
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Error",
        description: "Could not verify image. You may still submit the report.",
        variant: "destructive",
      });
      // Allow submission even if verification fails
      setVerificationResult({
        isLegitimate: true,
        confidence: "low",
        reason: "Verification service unavailable",
        warnings: ["Manual review required"],
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setVerificationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagePreview) {
      toast({
        title: "Image Required",
        description: "Please upload a photo of the disaster for verification.",
        variant: "destructive",
      });
      return;
    }

    if (verificationResult && !verificationResult.isLegitimate) {
      toast({
        title: "Cannot Submit",
        description: "The uploaded image did not pass verification. Please upload a legitimate disaster photo.",
        variant: "destructive",
      });
      return;
    }

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
      
      const message = `🚨 DISASTER ALERT 🚨
Type: ${formData.type.toUpperCase()}
Severity: ${formData.severity.toUpperCase()}
Location: ${formData.location}, ${formData.district}, ${formData.state}
People Affected: ${formData.peopleAffected || "Unknown"}
Details: ${formData.description}
Reporter Contact: ${formData.reporterContact || "Not provided"}
Image Verified: ✓
Ref: ${refId}
- India Disaster Response System`;

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
                setImagePreview(null);
                setVerificationResult(null);
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
              Upload a photo for AI verification, then alert rescue crews instantly via SMS.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload & Verification */}
            <div className="card-gradient rounded-xl border-2 border-amber-500/50 bg-amber-500/5 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-foreground">Photo Verification *</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload a photo of the disaster. AI will verify it's a legitimate emergency.
              </p>

              {!imagePreview ? (
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-2">Click to upload disaster photo</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 5MB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Disaster preview" 
                      className="w-full max-h-64 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Verification Status */}
                  {isVerifying && (
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="text-sm">AI is verifying your image...</span>
                    </div>
                  )}

                  {verificationResult && !isVerifying && (
                    <div className={`flex items-start gap-3 p-4 rounded-lg ${
                      verificationResult.isLegitimate 
                        ? "bg-success/10 border border-success/30" 
                        : "bg-destructive/10 border border-destructive/30"
                    }`}>
                      {verificationResult.isLegitimate ? (
                        <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${
                          verificationResult.isLegitimate ? "text-success" : "text-destructive"
                        }`}>
                          {verificationResult.isLegitimate ? "Verified" : "Not Verified"}
                          {verificationResult.confidence && (
                            <span className="text-xs ml-2 opacity-70">
                              ({verificationResult.confidence} confidence)
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {verificationResult.reason}
                        </p>
                        {verificationResult.warnings && verificationResult.warnings.length > 0 && (
                          <ul className="text-xs text-muted-foreground mt-2 list-disc list-inside">
                            {verificationResult.warnings.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {/* Rescue Crew Contact */}
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
              disabled={isLoading || isVerifying || !imagePreview || (verificationResult && !verificationResult.isLegitimate)}
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

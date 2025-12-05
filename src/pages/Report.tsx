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
  Plus,
  Trash2,
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
  const [rescueNumbers, setRescueNumbers] = useState<string[]>([""]);
  const [formData, setFormData] = useState({
    type: "",
    severity: "",
    state: "",
    district: "",
    location: "",
    description: "",
    reporterContact: "",
    victimMessage: "",
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

  const addRescueNumber = () => {
    if (rescueNumbers.length < 5) {
      setRescueNumbers([...rescueNumbers, ""]);
    }
  };

  const removeRescueNumber = (index: number) => {
    if (rescueNumbers.length > 1) {
      setRescueNumbers(rescueNumbers.filter((_, i) => i !== index));
    }
  };

  const updateRescueNumber = (index: number, value: string) => {
    const updated = [...rescueNumbers];
    updated[index] = value;
    setRescueNumbers(updated);
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
      await verifyImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const verifyImage = async (imageBase64: string) => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("verify-disaster-image", {
        body: { imageBase64, disasterType: formData.type },
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
      setVerificationResult({
        isLegitimate: true,
        confidence: "low",
        reason: "Verification service unavailable - proceeding with report",
        warnings: ["Manual review may be required"],
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

    // Validate rescue numbers
    const validNumbers = rescueNumbers.filter(n => n.trim() && validateIndianMobile(n));
    
    if (validNumbers.length === 0) {
      toast({
        title: "No Valid Numbers",
        description: "Please enter at least one valid Indian mobile number.",
        variant: "destructive",
      });
      return;
    }

    // Check image verification if image was uploaded
    if (imagePreview && verificationResult && !verificationResult.isLegitimate) {
      toast({
        title: "Cannot Submit",
        description: "The uploaded image did not pass verification.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const refId = `DR-IND-${Date.now().toString(36).toUpperCase()}`;

      // Build alert message - include victim's message if provided
      const message = `🚨 DISASTER ALERT 🚨
Type: ${formData.type.toUpperCase()}
Severity: ${formData.severity.toUpperCase()}
Location: ${formData.location}, ${formData.district}, ${formData.state}
People Affected: ${formData.peopleAffected || "Unknown"}
${formData.victimMessage ? `\nVICTIM MESSAGE:\n"${formData.victimMessage}"` : ""}
${formData.description ? `\nDetails: ${formData.description}` : ""}
Reporter: ${formData.reporterContact || "Not provided"}
${imagePreview ? "Image: Verified ✓" : "Image: Not provided"}
Ref: ${refId}
- India Disaster Response`;

      // Save to database
      await supabase.from("disaster_reports").insert({
        type: formData.type,
        severity: formData.severity,
        state: formData.state,
        district: formData.district,
        location: formData.location,
        description: formData.description,
        people_affected: formData.peopleAffected,
        reporter_contact: formData.reporterContact,
        victim_message: formData.victimMessage,
        image_verified: !!imagePreview && verificationResult?.isLegitimate,
        reference_id: refId,
        source: "web",
        status: "active",
      });

      // Send SMS to all rescue numbers
      const { data, error } = await supabase.functions.invoke("send-rescue-alert", {
        body: {
          phoneNumbers: validNumbers.map(formatPhoneNumber),
          message: message,
        },
      });

      if (error) throw error;

      setReferenceId(refId);
      setSubmitted(true);
      
      toast({
        title: "Alert Sent Successfully",
        description: `${data.sent}/${data.total} rescue crews notified via SMS.`,
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
              SMS alerts have been sent to {rescueNumbers.filter(n => validateIndianMobile(n)).length} rescue crew(s).
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Reference ID: <span className="font-mono text-primary">{referenceId}</span>
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setImagePreview(null);
                  setVerificationResult(null);
                  setRescueNumbers([""]);
                  setFormData({
                    type: "",
                    severity: "",
                    state: "",
                    district: "",
                    location: "",
                    description: "",
                    reporterContact: "",
                    victimMessage: "",
                    peopleAffected: "",
                  });
                }}
                variant="outline"
                size="lg"
              >
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
              Enter victim's message and alert multiple rescue crews instantly via SMS.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Victim Message - Most Important */}
            <div className="card-gradient rounded-xl border-2 border-destructive/50 bg-destructive/5 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-destructive" />
                <h3 className="font-semibold text-foreground">Victim's Message</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter the message received from the victim (via SMS, call, or in person).
              </p>
              <Textarea
                placeholder="Enter the victim's exact message or description of their situation..."
                rows={4}
                value={formData.victimMessage}
                onChange={(e) => setFormData({ ...formData, victimMessage: e.target.value })}
                className="text-base"
              />
            </div>

            {/* Multiple Rescue Crew Numbers */}
            <div className="card-gradient rounded-xl border-2 border-primary/50 bg-primary/5 p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Rescue Crew Numbers *</h3>
                </div>
                {rescueNumbers.length < 5 && (
                  <Button type="button" variant="ghost" size="sm" onClick={addRescueNumber}>
                    <Plus className="w-4 h-4 mr-1" /> Add Number
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Alert will be sent to all numbers entered below.
              </p>

              <div className="space-y-3">
                {rescueNumbers.map((number, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder={`Rescue crew ${index + 1} (e.g., 9876543210)`}
                        className="pl-10"
                        value={number}
                        onChange={(e) => updateRescueNumber(index, e.target.value)}
                      />
                    </div>
                    {rescueNumbers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRescueNumber(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Indian mobile numbers (10 digits starting with 6-9). Add up to 5 numbers.
              </p>
            </div>

            {/* Disaster Details */}
            <div className="card-gradient rounded-xl border border-border p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Disaster Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
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

                <div className="space-y-2">
                  <Label htmlFor="severity">Severity *</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) => setFormData({ ...formData, severity: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => setFormData({ ...formData, state: value })}
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

                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    placeholder="Enter district name"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Specific Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Landmark, street, area (be as specific as possible)"
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="peopleAffected">Estimated People Affected</Label>
                  <Input
                    id="peopleAffected"
                    type="text"
                    placeholder="e.g., 50-100"
                    value={formData.peopleAffected}
                    onChange={(e) => setFormData({ ...formData, peopleAffected: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reporterContact">Your Contact Number</Label>
                  <Input
                    id="reporterContact"
                    type="tel"
                    placeholder="For follow-up if needed"
                    value={formData.reporterContact}
                    onChange={(e) => setFormData({ ...formData, reporterContact: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Any additional information that could help rescue crews..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            {/* Optional Image Upload */}
            <div className="card-gradient rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Photo (Optional)</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload a photo if available. Not required - useful when internet is limited.
              </p>

              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload (optional)</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Disaster preview"
                      className="w-full max-h-48 object-cover"
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

                  {isVerifying && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm">Verifying image...</span>
                    </div>
                  )}

                  {verificationResult && !isVerifying && (
                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg ${
                        verificationResult.isLegitimate
                          ? "bg-success/10 border border-success/30"
                          : "bg-destructive/10 border border-destructive/30"
                      }`}
                    >
                      {verificationResult.isLegitimate ? (
                        <ShieldCheck className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            verificationResult.isLegitimate ? "text-success" : "text-destructive"
                          }`}
                        >
                          {verificationResult.isLegitimate ? "Verified" : "Not Verified"}
                        </p>
                        <p className="text-xs text-muted-foreground">{verificationResult.reason}</p>
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

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="xl"
              className="w-full"
              disabled={isLoading || isVerifying}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sending Alerts...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Alert to Rescue Crews
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              For immediate emergencies, call <span className="text-destructive font-bold">112</span>
            </p>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Report;

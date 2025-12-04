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
  Camera,
  Send,
  CheckCircle,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const disasterTypes = [
  "Flood",
  "Earthquake",
  "Wildfire",
  "Hurricane",
  "Tornado",
  "Landslide",
  "Tsunami",
  "Industrial Accident",
  "Other",
];

const severityLevels = [
  { value: "low", label: "Low - Minor damage, no immediate danger" },
  { value: "medium", label: "Medium - Significant damage, potential danger" },
  { value: "high", label: "High - Severe damage, immediate danger" },
  { value: "critical", label: "Critical - Life-threatening emergency" },
];

const Report = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    severity: "",
    location: "",
    description: "",
    contact: "",
    peopleAffected: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setSubmitted(true);
    toast({
      title: "Report Submitted",
      description: "Emergency responders have been notified.",
    });
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
              Report Submitted Successfully
            </h1>
            <p className="text-muted-foreground mb-8">
              Your disaster report has been received. Emergency response teams have
              been notified and will assess the situation immediately.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Reference ID: <span className="font-mono text-primary">DR-2024-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline" size="lg">
              Submit Another Report
            </Button>
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
              Your report helps emergency responders act quickly. Please provide as
              much detail as possible.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card-gradient rounded-xl border border-border p-6 space-y-6">
              {/* Disaster Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Disaster Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value })
                  }
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

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="Enter address or coordinates"
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
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the situation in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label>Upload Photos (Optional)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop images or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 5 files, 10MB each
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact">Your Contact Number</Label>
                <Input
                  id="contact"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Responders may contact you for additional information
                </p>
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" variant="hero" size="xl" className="w-full">
              <Send className="w-5 h-5" />
              Submit Report
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              For immediate life-threatening emergencies, please call{" "}
              <span className="text-destructive font-semibold">911</span> directly.
            </p>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Report;

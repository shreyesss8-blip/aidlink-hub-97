import { motion } from "framer-motion";
import { MapPin, Clock, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DisasterCardProps {
  id: string;
  type: string;
  location: string;
  severity: "critical" | "high" | "medium" | "low";
  affectedPeople: number;
  reportedTime: string;
  status: "active" | "monitoring" | "resolved";
}

export const DisasterCard = ({
  type,
  location,
  severity,
  affectedPeople,
  reportedTime,
  status,
}: DisasterCardProps) => {
  const severityColors = {
    critical: "bg-destructive text-destructive-foreground",
    high: "bg-primary text-primary-foreground",
    medium: "bg-warning text-warning-foreground",
    low: "bg-success text-success-foreground",
  };

  const statusColors = {
    active: "text-destructive",
    monitoring: "text-primary",
    resolved: "text-success",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="card-gradient rounded-xl border border-border p-5 transition-all duration-300 hover:border-primary/50"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg">
            <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{type}</h3>
            <span className={`text-xs font-medium ${statusColors[status]}`}>
              ● {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${severityColors[severity]}`}
        >
          {severity.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{affectedPeople.toLocaleString()} people affected</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Reported {reportedTime}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          View Details
        </Button>
        <Button variant="default" size="sm" className="flex-1">
          Respond
        </Button>
      </div>
    </motion.div>
  );
};

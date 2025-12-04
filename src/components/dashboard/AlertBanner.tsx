import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface AlertBannerProps {
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
}

export const AlertBanner = ({ type, title, message }: AlertBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const styles = {
    critical: "bg-destructive/20 border-destructive text-destructive",
    warning: "bg-primary/20 border-primary text-primary",
    info: "bg-secondary border-border text-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-lg border p-4 ${styles[type]} ${type === "critical" ? "alert-pulse" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm opacity-90 mt-1">{message}</p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-background/20 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

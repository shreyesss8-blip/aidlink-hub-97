import { Link } from "react-router-dom";
import { AlertTriangle, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">DisasterGuard</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Protecting communities through rapid disaster response and coordination.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Dashboard
              </Link>
              <Link to="/report" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Report Disaster
              </Link>
              <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Resources
              </Link>
              <Link to="/contacts" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                Emergency Contacts
              </Link>
            </div>
          </div>

          {/* Emergency */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Emergency</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-destructive" />
                <span className="text-muted-foreground">Emergency: 911</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Helpline: 1-800-HELP</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">support@disasterguard.org</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Emergency Response Center</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 DisasterGuard. Built for community safety.
          </p>
        </div>
      </div>
    </footer>
  );
};

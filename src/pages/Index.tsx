import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Users,
  MapPin,
  Shield,
  ArrowRight,
  Zap,
  FileText,
  Phone,
  MessageSquare,
} from "lucide-react";
import DisasterMap from "@/components/DisasterMap";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              India Disaster Response System
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Rescue Crew
              <span className="text-gradient block">Alert System</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Report disasters and instantly alert multiple rescue crews across India.
              Victims can send SMS messages which get forwarded to rescue teams.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/report">
                <Button variant="hero" size="xl">
                  <AlertTriangle className="w-5 h-5" />
                  Report Disaster
                </Button>
              </Link>
              <Link to="/contacts">
                <Button variant="outline" size="xl">
                  Emergency Contacts
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <AlertBanner
          type="warning"
          title="For Rescue Crews & Emergency Responders"
          message="This system alerts rescue teams via SMS when disasters are reported. Victims can also SMS their emergency to our Twilio number for automatic forwarding."
        />
      </section>

      {/* Live Disaster Map */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Live Disaster Map
          </h2>
          <DisasterMap />
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Two ways to alert rescue crews during emergencies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          {/* Web Report Path */}
          <div className="card-gradient rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Via Web (Middleman)
            </h3>
            <ol className="space-y-4">
              {[
                "Receive victim's message (call/SMS/in person)",
                "Enter details in the report form",
                "Add multiple rescue crew numbers",
                "All crews receive SMS alerts instantly",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* SMS Path */}
          <div className="card-gradient rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Via SMS (Direct from Victim)
            </h3>
            <ol className="space-y-4">
              {[
                "Victim sends SMS to our Twilio number",
                "Format: TYPE|LOCATION|MESSAGE",
                "System auto-creates alert",
                "All registered crews notified",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Report Incident",
              description: "Alert rescue crews",
              icon: AlertTriangle,
              href: "/report",
              color: "bg-destructive/10 text-destructive",
            },
            {
              title: "Find Resources",
              description: "Shelters & supplies info",
              icon: MapPin,
              href: "/resources",
              color: "bg-primary/10 text-primary",
            },
            {
              title: "Learn More",
              description: "About this system",
              icon: Users,
              href: "/about",
              color: "bg-success/10 text-success",
            },
            {
              title: "Emergency Numbers",
              description: "India helplines",
              icon: Shield,
              href: "/contacts",
              color: "bg-warning/10 text-warning",
            },
          ].map((action, index) => (
            <Link key={action.title} to={action.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="card-gradient rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gradient rounded-xl border border-destructive/30 bg-destructive/5 p-6"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Important Notice</h3>
              <p className="text-sm text-muted-foreground">
                For immediate life-threatening emergencies, always call{" "}
                <span className="text-destructive font-bold">112</span> (National Emergency Number)
                or <span className="text-destructive font-bold">100</span> (Police),{" "}
                <span className="text-destructive font-bold">101</span> (Fire),{" "}
                <span className="text-destructive font-bold">102</span> (Ambulance) directly. This
                system supplements but does not replace official emergency services.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Index;

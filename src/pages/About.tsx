import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Shield,
  Users,
  Zap,
  Globe,
  Heart,
  Clock,
  Target,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-Time Monitoring",
    description:
      "Track disasters as they happen with live updates from multiple data sources.",
  },
  {
    icon: Globe,
    title: "Wide Coverage",
    description:
      "Monitor natural disasters across regions with comprehensive geographical coverage.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Crowdsourced reports from citizens help identify emerging situations quickly.",
  },
  {
    icon: Shield,
    title: "Verified Information",
    description:
      "All reports are verified by our team before being distributed to the public.",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Report Incident",
    description:
      "Citizens can report disasters through our platform with location and severity details.",
  },
  {
    step: "02",
    title: "Verification",
    description:
      "Our team verifies reports using satellite data and official sources.",
  },
  {
    step: "03",
    title: "Alert Distribution",
    description:
      "Verified alerts are distributed to affected areas and emergency services.",
  },
  {
    step: "04",
    title: "Response Coordination",
    description:
      "Resources and volunteers are coordinated for effective disaster response.",
  },
];

const stats = [
  { value: "50K+", label: "People Helped" },
  { value: "500+", label: "Disasters Tracked" },
  { value: "24/7", label: "Monitoring" },
  { value: "100+", label: "Partner Organizations" },
];

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About <span className="text-gradient">DisasterGuard</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              We're on a mission to protect communities through technology-driven
              disaster management. Our platform connects citizens, responders, and
              resources for faster, more effective emergency response.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-gradient rounded-2xl border border-border p-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-muted-foreground mb-6">
              DisasterGuard was created with one purpose: to save lives through
              better disaster preparedness and response. We believe that by
              connecting communities with real-time information and resources, we
              can significantly reduce the impact of natural disasters.
            </p>
            <p className="text-muted-foreground mb-8">
              Our platform combines cutting-edge technology with human expertise to
              provide accurate, timely, and actionable information during
              emergencies. From early warning systems to resource coordination, we're
              here to help communities prepare, respond, and recover.
            </p>
            <div className="space-y-3">
              {[
                "Reduce disaster response time by 50%",
                "Connect 1 million people to emergency resources",
                "Partner with 500+ emergency response organizations",
              ].map((goal, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success shrink-0" />
                  <span className="text-foreground">{goal}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                className="card-gradient rounded-xl border border-border p-5"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process ensures rapid response and effective disaster
              management from report to recovery.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
                )}
                <div className="card-gradient rounded-xl border border-border p-6 relative z-10">
                  <span className="text-4xl font-bold text-primary/30">
                    {item.step}
                  </span>
                  <h3 className="font-semibold text-foreground mt-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gradient rounded-2xl border border-primary/30 bg-primary/10 p-12 text-center"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Join Our Mission
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you want to volunteer, partner with us, or simply stay
            informed, there are many ways to contribute to disaster preparedness
            in your community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/report">
              <Button variant="hero" size="lg">
                Report a Disaster
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contacts">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default About;

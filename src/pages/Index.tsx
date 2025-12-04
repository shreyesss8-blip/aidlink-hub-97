import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { StatCard } from "@/components/dashboard/StatCard";
import { DisasterCard } from "@/components/dashboard/DisasterCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Users,
  MapPin,
  Shield,
  ArrowRight,
  Zap,
  Heart,
  Building,
} from "lucide-react";

const activeDisasters = [
  {
    id: "1",
    type: "Flood Warning",
    location: "Riverside District, CA",
    severity: "critical" as const,
    affectedPeople: 15000,
    reportedTime: "2 hours ago",
    status: "active" as const,
  },
  {
    id: "2",
    type: "Wildfire Alert",
    location: "Mountain View County",
    severity: "high" as const,
    affectedPeople: 8500,
    reportedTime: "5 hours ago",
    status: "active" as const,
  },
  {
    id: "3",
    type: "Earthquake Aftershock",
    location: "Bay Area Region",
    severity: "medium" as const,
    affectedPeople: 2300,
    reportedTime: "1 day ago",
    status: "monitoring" as const,
  },
];

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
              Real-time Disaster Monitoring
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Protecting Communities
              <span className="text-gradient block">When It Matters Most</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              DisasterGuard provides real-time disaster tracking, emergency response
              coordination, and resource management to help communities prepare,
              respond, and recover from natural disasters.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/report">
                <Button variant="hero" size="xl">
                  <AlertTriangle className="w-5 h-5" />
                  Report Disaster
                </Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline" size="xl">
                  Find Resources
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alert Banner */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <AlertBanner
          type="critical"
          title="Active Emergency: Flood Warning"
          message="A flash flood warning is in effect for Riverside District. Residents are advised to move to higher ground immediately."
        />
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Disasters"
            value={12}
            subtitle="Across 8 regions"
            icon={AlertTriangle}
            variant="danger"
            trend="up"
            trendValue="3 new today"
          />
          <StatCard
            title="People Affected"
            value="45.2K"
            subtitle="In need of assistance"
            icon={Users}
            variant="warning"
          />
          <StatCard
            title="Shelters Open"
            value={156}
            subtitle="87% capacity"
            icon={Building}
            variant="default"
          />
          <StatCard
            title="Volunteers Active"
            value="2,847"
            subtitle="Ready to help"
            icon={Heart}
            variant="success"
            trend="up"
            trendValue="234 joined today"
          />
        </div>
      </section>

      {/* Active Disasters */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Active Disasters</h2>
            <p className="text-muted-foreground mt-1">
              Monitor and respond to ongoing emergencies
            </p>
          </div>
          <Button variant="outline">
            View All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDisasters.map((disaster, index) => (
            <motion.div
              key={disaster.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <DisasterCard {...disaster} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-foreground mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Report Incident",
              description: "Submit a disaster report",
              icon: AlertTriangle,
              href: "/report",
              color: "bg-destructive/10 text-destructive",
            },
            {
              title: "Find Shelter",
              description: "Locate nearby safe zones",
              icon: MapPin,
              href: "/resources",
              color: "bg-primary/10 text-primary",
            },
            {
              title: "Volunteer",
              description: "Join relief efforts",
              icon: Users,
              href: "/about",
              color: "bg-success/10 text-success",
            },
            {
              title: "Emergency Call",
              description: "Contact responders",
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
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;

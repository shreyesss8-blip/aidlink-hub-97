import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Building,
  Package,
  Heart,
  ExternalLink,
  Phone,
  Globe,
  AlertTriangle,
  Info,
} from "lucide-react";

// Real Indian Disaster Relief Organizations
const reliefOrganizations = [
  {
    name: "NDRF (National Disaster Response Force)",
    description: "Primary federal agency for disaster response",
    website: "https://ndrf.gov.in",
    phone: "011-24363260",
    services: ["Search & Rescue", "Medical First Response", "Evacuation"],
  },
  {
    name: "Indian Red Cross Society",
    description: "Humanitarian aid and disaster relief",
    website: "https://indianredcross.org",
    phone: "011-23716441",
    services: ["Emergency Shelter", "Medical Aid", "Blood Bank", "Relief Distribution"],
  },
  {
    name: "Goonj",
    description: "Material support and relief distribution",
    website: "https://goonj.org",
    phone: "011-41401216",
    services: ["Clothing", "Essentials", "Rehabilitation"],
  },
  {
    name: "Rapid Response",
    description: "First responder volunteer network",
    website: "https://rapidresponse.org.in",
    phone: "1800-121-4848",
    services: ["Emergency Response", "First Aid", "Search Operations"],
  },
];

// Real Government Resources
const governmentResources = [
  {
    name: "NDMA - Disaster Management Plan",
    description: "Official guidelines and disaster preparedness information",
    website: "https://ndma.gov.in",
    icon: Building,
  },
  {
    name: "IMD Weather Alerts",
    description: "Real-time weather warnings and cyclone tracking",
    website: "https://mausam.imd.gov.in",
    icon: Globe,
  },
  {
    name: "CWC Flood Forecasting",
    description: "River water levels and flood warnings",
    website: "https://cwc.gov.in",
    icon: MapPin,
  },
  {
    name: "ISRO Disaster Management",
    description: "Satellite imagery for disaster monitoring",
    website: "https://nrsc.gov.in",
    icon: Globe,
  },
];

const essentialSupplies = [
  {
    category: "Emergency Kit Essentials",
    items: ["Drinking Water (3L per person/day)", "Non-perishable food", "First Aid Kit", "Flashlight & Batteries", "Important Documents", "Cash", "Phone Charger"],
    icon: Package,
  },
  {
    category: "Medical Supplies",
    items: ["Prescription Medications", "Basic First Aid", "ORS Packets", "Antiseptic", "Face Masks", "Hand Sanitizer"],
    icon: Heart,
  },
];

const Resources = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Disaster Relief Resources
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Official relief organizations and government resources for disaster preparedness 
            and response in India.
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 card-gradient rounded-xl border border-warning/30 bg-warning/10 p-6"
        >
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-warning shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Real-Time Shelter Information</h3>
              <p className="text-sm text-muted-foreground">
                For current shelter locations and availability during active disasters, contact your 
                local District Disaster Management Authority or call the state disaster helpline. 
                Shelter availability changes rapidly during emergencies.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Relief Organizations */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Relief Organizations
            </h2>

            <div className="space-y-4">
              {reliefOrganizations.map((org, index) => (
                <motion.div
                  key={org.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-gradient rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-2">
                        {org.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {org.description}
                      </p>

                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span className="text-primary font-medium">{org.phone}</span>
                        </div>
                      </div>

                      {/* Services */}
                      <div className="flex flex-wrap gap-2">
                        {org.services.map((service) => (
                          <span
                            key={service}
                            className="px-2 py-1 bg-secondary rounded-md text-xs text-muted-foreground"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => window.open(`tel:${org.phone.replace(/[^0-9+]/g, "")}`)}
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(org.website, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Government Resources */}
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 pt-6">
              <Globe className="w-5 h-5 text-primary" />
              Government Resources
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {governmentResources.map((resource, index) => (
                <motion.div
                  key={resource.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-gradient rounded-xl border border-border p-5 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  onClick={() => window.open(resource.website, "_blank")}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-secondary rounded-lg shrink-0">
                      <resource.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {resource.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Supplies Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Emergency Preparedness
            </h2>

            <div className="space-y-4">
              {essentialSupplies.map((supply, index) => (
                <motion.div
                  key={supply.category}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-gradient rounded-xl border border-border p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-secondary rounded-lg">
                      <supply.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">
                      {supply.category}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {supply.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="card-gradient rounded-xl border border-destructive/30 bg-destructive/5 p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    During Emergency
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you're affected by a disaster, immediately contact:
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-destructive font-bold">112 - National Emergency</p>
                    <p className="text-muted-foreground">1078 - NDMA Helpline</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
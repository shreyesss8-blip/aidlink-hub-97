import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Phone,
  AlertTriangle,
  Shield,
  Heart,
  Flame,
  Car,
  Building,
  Globe,
  Copy,
  ExternalLink,
  Users,
  Waves,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Real Indian Emergency Numbers
const emergencyContacts = [
  {
    name: "National Emergency Number",
    number: "112",
    description: "Police, Fire, Ambulance - Single emergency number",
    icon: AlertTriangle,
    color: "bg-destructive/20 text-destructive",
    priority: true,
  },
  {
    name: "NDRF Control Room",
    number: "011-24363260",
    description: "National Disaster Response Force",
    icon: Shield,
    color: "bg-primary/20 text-primary",
    priority: true,
  },
];

const governmentHelplines = [
  {
    name: "Police",
    number: "100",
    description: "Police emergency helpline",
    icon: Shield,
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    name: "Fire Service",
    number: "101",
    description: "Fire emergency helpline",
    icon: Flame,
    color: "bg-orange-500/20 text-orange-400",
  },
  {
    name: "Ambulance",
    number: "102",
    description: "Medical emergency ambulance",
    icon: Heart,
    color: "bg-pink-500/20 text-pink-400",
  },
  {
    name: "Women Helpline",
    number: "1091",
    description: "Women in distress helpline",
    icon: Users,
    color: "bg-purple-500/20 text-purple-400",
  },
  {
    name: "Child Helpline",
    number: "1098",
    description: "Child protection helpline",
    icon: Heart,
    color: "bg-green-500/20 text-green-400",
  },
  {
    name: "Road Accident",
    number: "1073",
    description: "Road accident emergency",
    icon: Car,
    color: "bg-yellow-500/20 text-yellow-400",
  },
];

const disasterManagementContacts = [
  {
    name: "NDMA (National Disaster Management)",
    number: "1078",
    description: "National Disaster Management Authority toll-free",
    icon: Building,
    website: "https://ndma.gov.in",
  },
  {
    name: "Indian Meteorological Department",
    number: "1800-180-1717",
    description: "Weather warnings and cyclone alerts",
    icon: Globe,
    website: "https://mausam.imd.gov.in",
  },
  {
    name: "Central Water Commission",
    number: "011-26109590",
    description: "Flood forecasting and warnings",
    icon: Waves,
    website: "https://cwc.gov.in",
  },
  {
    name: "Earthquake Helpline",
    number: "011-24619943",
    description: "Indian National Center for Seismology",
    icon: Zap,
    website: "https://seismo.gov.in",
  },
];

const stateDisasterNumbers = [
  { state: "Maharashtra", number: "1916" },
  { state: "Kerala", number: "1070" },
  { state: "Tamil Nadu", number: "1070" },
  { state: "Karnataka", number: "1070" },
  { state: "Andhra Pradesh", number: "1070" },
  { state: "Gujarat", number: "1070" },
  { state: "Rajasthan", number: "1070" },
  { state: "West Bengal", number: "1070" },
  { state: "Uttar Pradesh", number: "1070" },
  { state: "Delhi", number: "1077" },
];

const Contacts = () => {
  const { toast } = useToast();

  const copyNumber = (number: string, name: string) => {
    navigator.clipboard.writeText(number.replace(/[^0-9]/g, ""));
    toast({
      title: "Number Copied",
      description: `${name} number copied to clipboard`,
    });
  };

  const callNumber = (number: string) => {
    window.open(`tel:${number.replace(/[^0-9+]/g, "")}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Phone className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            India Emergency Contacts
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Official emergency helplines and disaster management contacts for India. 
            Save these numbers for immediate access during emergencies.
          </p>
        </motion.div>

        {/* Priority Emergency Numbers */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Priority Emergency Lines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-xl border-2 border-destructive/50 bg-destructive/10 p-6"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${contact.color}`}>
                      <contact.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg">
                        {contact.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        {contact.description}
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {contact.number}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={() => callNumber(contact.number)}
                    >
                      <Phone className="w-4 h-4" />
                      Call Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyNumber(contact.number, contact.name)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Government Helplines */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Government Emergency Helplines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {governmentHelplines.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-gradient rounded-xl border border-border p-5 hover:border-primary/50 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${contact.color} flex items-center justify-center mb-4`}>
                  <contact.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {contact.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {contact.description}
                </p>
                <p className="text-2xl font-bold text-foreground mb-4">
                  {contact.number}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => callNumber(contact.number)}
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyNumber(contact.number, contact.name)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Disaster Management Contacts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Disaster Management Agencies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {disasterManagementContacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-gradient rounded-xl border border-border p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-secondary rounded-lg">
                    <contact.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {contact.description}
                    </p>
                  </div>
                </div>
                <p className="text-xl font-bold text-foreground mb-4">
                  {contact.number}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() => callNumber(contact.number)}
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(contact.website, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Website
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* State Disaster Helplines */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            State Disaster Helplines
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {stateDisasterNumbers.map((item, index) => (
              <motion.div
                key={item.state}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="card-gradient rounded-lg border border-border p-4 text-center hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => callNumber(item.number)}
              >
                <p className="text-xs text-muted-foreground mb-1">{item.state}</p>
                <p className="text-lg font-bold text-primary">{item.number}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Important Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card-gradient rounded-xl border border-primary/30 bg-primary/10 p-6"
        >
          <h3 className="font-semibold text-foreground mb-2">
            Save These Numbers
          </h3>
          <p className="text-muted-foreground text-sm mb-4">
            During emergencies, phone networks may be overloaded. Save these numbers
            to your phone now for quick access when you need them most.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Note:</strong> All numbers listed are official government helplines verified from NDMA and respective state government sources.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contacts;
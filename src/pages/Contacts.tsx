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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emergencyContacts = [
  {
    name: "Emergency Services",
    number: "911",
    description: "Police, Fire, Medical Emergency",
    icon: AlertTriangle,
    color: "bg-destructive/20 text-destructive",
    priority: true,
  },
  {
    name: "Disaster Helpline",
    number: "1-800-DISASTER",
    description: "24/7 Disaster Assistance",
    icon: Phone,
    color: "bg-primary/20 text-primary",
    priority: true,
  },
];

const departmentContacts = [
  {
    name: "Fire Department",
    number: "1-555-FIRE-911",
    description: "Fire emergencies and rescue",
    icon: Flame,
    color: "bg-orange-500/20 text-orange-400",
  },
  {
    name: "Police Department",
    number: "1-555-POLICE",
    description: "Non-emergency police line",
    icon: Shield,
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    name: "Medical Services",
    number: "1-555-MEDICAL",
    description: "Non-emergency medical assistance",
    icon: Heart,
    color: "bg-pink-500/20 text-pink-400",
  },
  {
    name: "Road Assistance",
    number: "1-555-ROADS",
    description: "Road closures and conditions",
    icon: Car,
    color: "bg-green-500/20 text-green-400",
  },
];

const organizationContacts = [
  {
    name: "Red Cross",
    number: "1-800-RED-CROSS",
    description: "Disaster relief and shelter",
    icon: Heart,
    website: "https://redcross.org",
  },
  {
    name: "FEMA",
    number: "1-800-621-3362",
    description: "Federal disaster assistance",
    icon: Building,
    website: "https://fema.gov",
  },
  {
    name: "National Weather Service",
    number: "1-800-WEATHER",
    description: "Weather alerts and forecasts",
    icon: Globe,
    website: "https://weather.gov",
  },
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
            Emergency Contacts
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Quick access to emergency services and disaster assistance. Save these
            numbers for immediate access during emergencies.
          </p>
        </motion.div>

        {/* Emergency Numbers */}
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
                      <p className="text-2xl font-bold text-primary">
                        {contact.number}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={() =>
                        window.open(`tel:${contact.number.replace(/[^0-9]/g, "")}`)
                      }
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

        {/* Department Contacts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Department Contacts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentContacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
                <p className="text-lg font-bold text-foreground mb-4">
                  {contact.number}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      window.open(`tel:${contact.number.replace(/[^0-9]/g, "")}`)
                    }
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

        {/* Organization Contacts */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Relief Organizations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {organizationContacts.map((contact, index) => (
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
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {contact.description}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-bold text-foreground mb-4">
                  {contact.number}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      window.open(`tel:${contact.number.replace(/[^0-9]/g, "")}`)
                    }
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

        {/* Tip Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 card-gradient rounded-xl border border-primary/30 bg-primary/10 p-6"
        >
          <h3 className="font-semibold text-foreground mb-2">
            Save These Numbers
          </h3>
          <p className="text-muted-foreground text-sm">
            During emergencies, phone networks may be overloaded. Save these numbers
            to your phone now for quick access when you need them most.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contacts;

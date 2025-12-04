import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Search,
  Building,
  Package,
  Droplets,
  Utensils,
  Bed,
  Heart,
  Clock,
  Users,
  Navigation,
} from "lucide-react";
import { useState } from "react";

const shelters = [
  {
    id: 1,
    name: "Central Community Center",
    type: "Emergency Shelter",
    address: "123 Main Street, Downtown",
    distance: "0.8 miles",
    capacity: 500,
    currentOccupancy: 342,
    amenities: ["Food", "Water", "Medical", "Beds"],
    status: "open",
    hours: "24/7",
  },
  {
    id: 2,
    name: "Riverside High School",
    type: "Emergency Shelter",
    address: "456 River Road, Eastside",
    distance: "1.2 miles",
    capacity: 800,
    currentOccupancy: 567,
    amenities: ["Food", "Water", "Beds"],
    status: "open",
    hours: "24/7",
  },
  {
    id: 3,
    name: "St. Mary's Church",
    type: "Relief Center",
    address: "789 Oak Avenue, Midtown",
    distance: "2.1 miles",
    capacity: 200,
    currentOccupancy: 198,
    amenities: ["Food", "Water"],
    status: "limited",
    hours: "6AM - 10PM",
  },
  {
    id: 4,
    name: "National Guard Armory",
    type: "Emergency Shelter",
    address: "321 Military Drive, Northside",
    distance: "3.5 miles",
    capacity: 1200,
    currentOccupancy: 450,
    amenities: ["Food", "Water", "Medical", "Beds", "Pets"],
    status: "open",
    hours: "24/7",
  },
];

const supplies = [
  {
    category: "Food & Water",
    icon: Utensils,
    items: ["Bottled Water", "Canned Goods", "MREs", "Baby Formula"],
    availability: "high",
  },
  {
    category: "Medical Supplies",
    icon: Heart,
    items: ["First Aid Kits", "Medications", "Bandages", "Sanitizers"],
    availability: "medium",
  },
  {
    category: "Shelter Items",
    icon: Bed,
    items: ["Blankets", "Cots", "Pillows", "Sleeping Bags"],
    availability: "high",
  },
  {
    category: "Hygiene Products",
    icon: Droplets,
    items: ["Toiletries", "Diapers", "Feminine Products", "Soap"],
    availability: "medium",
  },
];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-success bg-success/20";
      case "limited":
        return "text-warning bg-warning/20";
      case "full":
        return "text-destructive bg-destructive/20";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getOccupancyColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-warning";
    return "bg-success";
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high":
        return "text-success";
      case "medium":
        return "text-warning";
      case "low":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
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
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Resources & Shelters
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find nearby emergency shelters, relief centers, and supply distribution
            points. All resources are updated in real-time.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by location, shelter name, or zip code..."
              className="pl-12 h-14 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button className="absolute right-2 top-1/2 -translate-y-1/2" size="sm">
              <Navigation className="w-4 h-4 mr-2" />
              Use My Location
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shelters List */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Nearby Shelters
            </h2>

            <div className="space-y-4">
              {shelters.map((shelter, index) => (
                <motion.div
                  key={shelter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-gradient rounded-xl border border-border p-6 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">
                          {shelter.name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            shelter.status
                          )}`}
                        >
                          {shelter.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {shelter.type}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{shelter.address}</span>
                          <span className="text-primary font-medium">
                            ({shelter.distance})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{shelter.hours}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>
                            {shelter.currentOccupancy} / {shelter.capacity} occupancy
                          </span>
                        </div>
                      </div>

                      {/* Occupancy Bar */}
                      <div className="mt-3">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getOccupancyColor(
                              shelter.currentOccupancy,
                              shelter.capacity
                            )} transition-all duration-500`}
                            style={{
                              width: `${
                                (shelter.currentOccupancy / shelter.capacity) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {shelter.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 bg-secondary rounded-md text-xs text-muted-foreground"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button variant="default" size="sm" className="shrink-0">
                      <Navigation className="w-4 h-4" />
                      Get Directions
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Supplies Sidebar */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Supply Status
            </h2>

            <div className="space-y-4">
              {supplies.map((supply, index) => (
                <motion.div
                  key={supply.category}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-gradient rounded-xl border border-border p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-secondary rounded-lg">
                      <supply.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {supply.category}
                      </h4>
                      <span
                        className={`text-xs font-medium ${getAvailabilityColor(
                          supply.availability
                        )}`}
                      >
                        {supply.availability.toUpperCase()} AVAILABILITY
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {supply.items.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-1 bg-background rounded text-xs text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="card-gradient rounded-xl border border-primary/30 bg-primary/10 p-5">
              <h4 className="font-semibold text-foreground mb-2">
                Need Supplies?
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Visit any open shelter to receive emergency supplies. Bring ID if
                available.
              </p>
              <Button variant="default" className="w-full">
                View All Distribution Points
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;

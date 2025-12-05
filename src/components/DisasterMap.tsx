import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DisasterReport {
  id: string;
  type: string;
  severity: string;
  location: string;
  state: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  created_at: string;
}

const severityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

const DisasterMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [mapboxToken, setMapboxToken] = useState(() => 
    localStorage.getItem("mapbox_token") || ""
  );
  const [tokenInput, setTokenInput] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);
  const [disasters, setDisasters] = useState<DisasterReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch disasters from database
  useEffect(() => {
    const fetchDisasters = async () => {
      const { data, error } = await supabase
        .from("disaster_reports")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching disasters:", error);
      } else {
        setDisasters(data || []);
      }
      setIsLoading(false);
    };

    fetchDisasters();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("disaster-updates")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "disaster_reports" },
        (payload) => {
          console.log("Disaster update:", payload);
          fetchDisasters();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Initialize map when token is set
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [78.9629, 20.5937], // Center of India
        zoom: 4,
        pitch: 30,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        "top-right"
      );

      map.current.on("load", () => {
        setIsMapReady(true);
      });

      return () => {
        map.current?.remove();
        map.current = null;
        setIsMapReady(false);
      };
    } catch (error) {
      console.error("Map initialization error:", error);
      localStorage.removeItem("mapbox_token");
      setMapboxToken("");
    }
  }, [mapboxToken]);

  // Add markers when map is ready and disasters are loaded
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for disasters with coordinates
    disasters.forEach((disaster) => {
      if (disaster.latitude && disaster.longitude) {
        const el = document.createElement("div");
        el.className = "disaster-marker";
        el.style.cssText = `
          width: 24px;
          height: 24px;
          background: ${severityColors[disaster.severity] || "#f97316"};
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          animation: pulse 2s infinite;
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; max-width: 200px;">
            <strong style="color: ${severityColors[disaster.severity]};">
              ${disaster.type.toUpperCase()}
            </strong>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              ${disaster.location}, ${disaster.district}, ${disaster.state}
            </p>
            <p style="font-size: 11px; color: #999;">
              ${new Date(disaster.created_at).toLocaleString()}
            </p>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([disaster.longitude, disaster.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);
      }
    });
  }, [disasters, isMapReady]);

  const handleSetToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem("mapbox_token", tokenInput.trim());
      setMapboxToken(tokenInput.trim());
    }
  };

  if (!mapboxToken) {
    return (
      <div className="card-gradient rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Disaster Map Setup</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          To view the live disaster map, enter your Mapbox public token.
          Get one free at{" "}
          <a
            href="https://mapbox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
          {" "}→ Account → Tokens
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="pk.eyJ1..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSetToken} disabled={!tokenInput.trim()}>
            Set Token
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Live Disaster Map</h3>
        </div>
        <div className="flex items-center gap-4 text-xs">
          {Object.entries(severityColors).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground capitalize">{level}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="relative h-[400px]">
        <div ref={mapContainer} className="absolute inset-0" />
        
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && disasters.length === 0 && (
          <div className="absolute bottom-4 left-4 bg-background/90 rounded-lg p-3 text-sm">
            <AlertTriangle className="w-4 h-4 text-muted-foreground inline mr-2" />
            No active disasters reported
          </div>
        )}

        {disasters.length > 0 && (
          <div className="absolute bottom-4 left-4 bg-background/90 rounded-lg p-3 text-sm">
            <span className="text-destructive font-medium">{disasters.length}</span>
            <span className="text-muted-foreground ml-1">active disaster(s)</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default DisasterMap;

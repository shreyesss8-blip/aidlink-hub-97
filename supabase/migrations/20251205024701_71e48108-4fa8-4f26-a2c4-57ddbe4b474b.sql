-- Create disaster reports table to track all reports and show on map
CREATE TABLE public.disaster_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  people_affected TEXT,
  reporter_contact TEXT,
  source TEXT DEFAULT 'web' CHECK (source IN ('web', 'sms')),
  victim_message TEXT,
  image_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'monitoring', 'resolved')),
  reference_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disaster_reports ENABLE ROW LEVEL SECURITY;

-- Public read access for viewing disasters on map
CREATE POLICY "Anyone can view disaster reports"
ON public.disaster_reports
FOR SELECT
USING (true);

-- Public insert for reporting disasters (no auth required for emergencies)
CREATE POLICY "Anyone can report disasters"
ON public.disaster_reports
FOR INSERT
WITH CHECK (true);

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.disaster_reports;

-- Create index for location queries
CREATE INDEX idx_disaster_reports_status ON public.disaster_reports(status);
CREATE INDEX idx_disaster_reports_created ON public.disaster_reports(created_at DESC);
-- Create rank_tracking_history table for storing user's rank checks
CREATE TABLE IF NOT EXISTS rank_tracking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  keyword TEXT NOT NULL,
  rank INTEGER,
  page INTEGER,
  position INTEGER,
  status TEXT DEFAULT 'pending',
  analysis TEXT,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_rank_tracking_user_id ON rank_tracking_history(user_id);
CREATE INDEX idx_rank_tracking_keyword ON rank_tracking_history(keyword);
CREATE INDEX idx_rank_tracking_url ON rank_tracking_history(url);
CREATE INDEX idx_rank_tracking_checked_at ON rank_tracking_history(checked_at DESC);

-- Enable RLS
ALTER TABLE rank_tracking_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rank tracking data
CREATE POLICY "Users can view their own rank tracking data"
  ON rank_tracking_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own rank tracking data
CREATE POLICY "Users can insert their own rank tracking data"
  ON rank_tracking_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own rank tracking data
CREATE POLICY "Users can update their own rank tracking data"
  ON rank_tracking_history
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own rank tracking data
CREATE POLICY "Users can delete their own rank tracking data"
  ON rank_tracking_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a view for user's rank tracking summary (for dashboard)
CREATE OR REPLACE VIEW user_rank_tracking_summary AS
SELECT 
  user_id,
  COUNT(*) as total_checks,
  COUNT(DISTINCT keyword) as unique_keywords,
  COUNT(DISTINCT url) as unique_urls,
  MAX(checked_at) as last_check,
  AVG(CASE WHEN rank IS NOT NULL THEN rank ELSE NULL END)::INTEGER as avg_rank
FROM rank_tracking_history
GROUP BY user_id;

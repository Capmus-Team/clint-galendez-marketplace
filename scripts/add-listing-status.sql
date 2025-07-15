-- Add status field to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'available';

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);

-- Update RLS policy to include status-based filtering
DROP POLICY IF EXISTS "Allow all operations on listings" ON listings;

-- Allow users to view all listings
CREATE POLICY "Allow read access to listings" ON listings
  FOR SELECT USING (true);

-- Allow users to create listings (setting initial status as 'available')
CREATE POLICY "Allow insert listings" ON listings
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own listings
CREATE POLICY "Allow update own listings" ON listings
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Allow users to delete their own listings
CREATE POLICY "Allow delete own listings" ON listings
  FOR DELETE USING (auth.uid()::text = user_id::text);

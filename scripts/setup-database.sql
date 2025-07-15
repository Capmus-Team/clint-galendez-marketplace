-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  contact_email TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  buyer_email TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for listings (allow all operations for now)
CREATE POLICY "Allow all operations on listings" ON listings
  FOR ALL USING (true);

-- Create policies for messages (allow all operations for now)
CREATE POLICY "Allow all operations on messages" ON messages
  FOR ALL USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('marketplace-images', 'marketplace-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for marketplace-images bucket
CREATE POLICY "Allow public access" ON storage.objects
  FOR SELECT USING (bucket_id = 'marketplace-images');

CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'marketplace-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Allow users to update own files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'marketplace-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Allow users to delete own files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'marketplace-images' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies for user-avatars bucket
CREATE POLICY "Allow public read access to avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-avatars');

CREATE POLICY "Allow users to upload own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'user-avatars' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Allow users to update own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'user-avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Allow users to delete own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'user-avatars' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

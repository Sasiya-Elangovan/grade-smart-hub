
-- Create a storage bucket for assessments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('assessments', 'Assessment Files', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'assessments');

-- Create policy to allow authenticated users to select their own files
CREATE POLICY "Allow authenticated users to select their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'assessments' AND (auth.uid() = owner OR owner IS NULL));

-- Create policy to allow authenticated users to update their own files
CREATE POLICY "Allow authenticated users to update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'assessments' AND auth.uid() = owner);

-- Create policy to allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated users to delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'assessments' AND auth.uid() = owner);

-- Create a storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'User Avatars', true);

-- Create policy to allow authenticated users to upload avatars
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Create policy to allow authenticated users to select their own avatars
CREATE POLICY "Allow authenticated users to select their own avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND (auth.uid() = owner OR owner IS NULL));

-- Create policy to allow authenticated users to update their own avatars
CREATE POLICY "Allow authenticated users to update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Create policy to allow authenticated users to delete their own avatars
CREATE POLICY "Allow authenticated users to delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

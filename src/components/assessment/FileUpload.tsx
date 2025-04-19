
import React, { useState } from 'react';
import { Upload, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

interface FileUploadProps {
  onFileUploaded?: (filePath: string) => void;
  bucketName?: string;
  acceptedFileTypes?: string;
  maxFileSize?: number; // in MB
  className?: string;
}

export function FileUpload({
  onFileUploaded,
  bucketName = 'assessments',
  acceptedFileTypes = 'image/*',
  maxFileSize = 5, // 5MB default
  className = '',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useAuth();

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    
    // Check file size (convert MB to bytes)
    if (file.size > maxFileSize * 1024 * 1024) {
      toast.error(`File size exceeds ${maxFileSize}MB limit`);
      return;
    }

    setUploadedFile(file);
    
    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  };

  const uploadFile = async () => {
    if (!uploadedFile || !user) {
      toast.error("Please select a file first or login");
      return;
    }
    
    try {
      setUploading(true);
      
      // Create bucket if it doesn't exist
      const { data: bucketExists } = await supabase.storage.getBucket(bucketName);
      
      if (!bucketExists) {
        const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
          public: true,
        });
        
        if (createBucketError) {
          throw createBucketError;
        }
      }
      
      // Create unique file path
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, uploadedFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
        
      if (onFileUploaded) {
        onFileUploaded(data.publicUrl);
      }
      
      toast.success('File uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(`File size exceeds ${maxFileSize}MB limit`);
        return;
      }
      
      setUploadedFile(file);
      
      if (file.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={`${className}`}>
      {!uploadedFile ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Upload File</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Click to browse or drag and drop your file here
            </p>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" className="mt-2">
                Select File
              </Button>
              <input
                type="file"
                className="hidden"
                onChange={handleFileSelected}
                accept={acceptedFileTypes}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {previewUrl ? (
                <div className="h-20 w-20 rounded bg-gray-100 overflow-hidden">
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div>
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFile}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={uploadFile}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Check className="h-4 w-4" />}
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

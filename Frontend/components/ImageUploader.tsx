
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { imgbbService } from '../services/imgbbService';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  initialImageUrl?: string | null;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete, initialImageUrl }) => {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If an initial image URL is provided and is not empty, set the preview
    if(initialImageUrl && initialImageUrl.length > 0) {
        setPreview(initialImageUrl);
        setStatus('success');
    } else {
        setPreview(null);
        setStatus('idle');
    }
  }, [initialImageUrl]);

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return;

    setStatus('uploading');
    setError(null);
    setPreview(URL.createObjectURL(file));

    try {
      const uploadedUrl = await imgbbService.upload(file);
      onUploadComplete(uploadedUrl);
      setPreview(uploadedUrl);
      setStatus('success');
    } catch (err: any) {
        console.error("Upload failed:", err);
        setError(`Przesyłanie nie powiodło się: ${err.message}`);
        setStatus('error');
    }

  }, [onUploadComplete]);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, [handleUpload]);

  const handlePaste = useCallback((event: React.ClipboardEvent) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleUpload(file);
        }
      }
    }
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
    multiple: false,
  });

  const removeImage = () => {
    setPreview(null);
    setStatus('idle');
    onUploadComplete('');
  };

  const renderContent = () => {
    switch (status) {
      case 'uploading':
        return (
          <div className="flex flex-col items-center justify-center text-ink-light">
            <Loader2 className="animate-spin h-8 w-8 mb-2" />
            <p className="font-bold">Przesyłanie...</p>
          </div>
        );
      case 'success':
      case 'error': // Also show preview on error to allow retry
        if (preview) {
          return (
            <>
              <img src={preview || undefined} alt="Podgląd" className="w-full h-full object-cover" />
              <button 
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/75 transition-colors z-10"
                title="Usuń obrazek"
              >
                <X size={16} />
              </button>
            </>
          );
        }
        // Fallback to idle if no preview
        return null;
      case 'idle':
      default:
        return (
          <div className="flex flex-col items-center justify-center text-center text-ink-light p-4">
            <Upload className="h-8 w-8 mb-2" />
            <p className="font-bold">
              {isDragActive ? 'Upuść obrazek tutaj...' : 'Przeciągnij i upuść'}
            </p>
            <p className="text-xs">lub kliknij, aby wybrać plik</p>
            <p className="text-xs mt-2">albo wklej ze schowka (Ctrl+V)</p>
          </div>
        );
    }
  };

  return (
    <div>
        <label className="block text-xs font-black uppercase tracking-widest mb-2 text-ink">Zdjęcie produktu</label>
        <div 
            {...getRootProps()}
            onPaste={handlePaste}
            tabIndex={0} // Make it focusable for paste
            className={`
                w-full h-48 border-2 border-dashed rounded-md flex items-center justify-center 
                cursor-pointer transition-colors relative overflow-hidden
                ${isDragActive ? 'border-accent bg-accent/10' : 'border-ink/20 hover:border-ink'}
                ${preview ? 'border-solid' : ''}
            `}
        >
            <input {...getInputProps()} />
            {renderContent()}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploader;

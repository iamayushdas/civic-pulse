'use client';

import { ChangeEvent, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  maxFiles?: number;
}

const MAX_FILE_BYTES = 512 * 1024;

export default function ImageUpload({
  images,
  onChange,
  label = 'PHOTOS (OPTIONAL)',
  maxFiles = 5,
}: ImageUploadProps) {
  const [error, setError] = useState('');

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setError('');

    const available = maxFiles - images.length;
    if (available <= 0) {
      setError(`You can add up to ${maxFiles} images.`);
      return;
    }

    const selected = files.slice(0, available);
    const oversized = selected.find((file) => file.size > MAX_FILE_BYTES);
    if (oversized) {
      setError(`${oversized.name} is larger than 512 KB.`);
      event.target.value = '';
      return;
    }

    try {
      const encoded = await Promise.all(selected.map((file) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Could not read image'));
        reader.readAsDataURL(file);
      })));
      onChange([...images, ...encoded]);
    } catch {
      setError('Could not read one of the selected images.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div>
      <label className="mb-2 block label-mono">{label}</label>
      <div className="border-2 border-dashed border-civic-black bg-civic-bg p-5">
        <label className="flex cursor-pointer flex-col items-center justify-center text-center">
          <Camera size={40} className="mb-3 text-civic-muted" />
          <span className="font-bold">CHOOSE IMAGES</span>
          <span className="mt-1 text-sm text-civic-muted">Up to {maxFiles} images, 512 KB each</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFiles} className="sr-only" />
        </label>
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => (
              <div key={`${image.slice(0, 30)}-${index}`} className="relative aspect-video border-2 border-civic-black bg-civic-white">
                <img src={image} alt={`Selected evidence ${index + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-1 top-1 border-2 border-black bg-white p-1 text-black shadow-brutal-sm"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm font-bold text-civic-accent">{error}</p>}
    </div>
  );
}

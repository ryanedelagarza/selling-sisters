import { useState, useRef, useCallback } from 'react';
import { clsx } from 'clsx';
import Button from './Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  accept?: string;
  maxSizeMB?: number;
  currentFile?: File | null;
  previewUrl?: string | null;
  error?: string;
  label?: string;
}

export default function FileUpload({
  onFileSelect,
  onFileClear,
  accept = 'image/jpeg,image/png',
  maxSizeMB = 10,
  currentFile,
  previewUrl,
  error,
  label = 'Upload Reference Photo',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = accept.split(',').map((t) => t.trim());
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a JPG or PNG image.';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File is too large. Maximum size is ${maxSizeMB}MB.`;
    }

    return null;
  };

  const handleFileChange = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        // Could emit error through a callback if needed
        console.error(validationError);
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect, accept, maxSizeMB]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileClear();
  };

  // Show preview if file is selected
  if (currentFile || previewUrl) {
    return (
      <div className="w-full">
        <label className="label">{label}</label>
        <div className="relative rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden">
          {/* Preview image */}
          <div className="aspect-video flex items-center justify-center p-4">
            <img
              src={previewUrl || (currentFile ? URL.createObjectURL(currentFile) : '')}
              alt="Upload preview"
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>

          {/* File info and actions */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {currentFile?.name || 'Uploaded image'}
                </p>
                {currentFile && (
                  <p className="text-xs text-gray-500">
                    {(currentFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleClick}>
                  Replace
                </Button>
                <Button variant="ghost" size="sm" onClick={handleRemove} className="text-error">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />

        {error && (
          <p className="error-message mt-2" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Show upload dropzone
  return (
    <div className="w-full">
      <label className="label">{label}</label>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          'relative rounded-xl border-2 border-dashed p-8 text-center cursor-pointer',
          'transition-colors duration-200',
          isDragging
            ? 'border-primary bg-primary-light'
            : error
            ? 'border-error bg-red-50'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        )}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={`${label}. Accepts JPG or PNG files up to ${maxSizeMB}MB`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
          aria-hidden="true"
        />

        {/* Upload icon */}
        <div className="mx-auto w-12 h-12 mb-4 text-gray-400">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <p className="text-base font-medium text-gray-700 mb-1">
          {isDragging ? 'Drop your image here!' : 'Tap to upload or drag and drop'}
        </p>
        <p className="text-sm text-gray-500">JPG or PNG, up to {maxSizeMB}MB</p>
      </div>

      {error && (
        <p className="error-message mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useImageUpload } from '../../hooks';
import { isBraceletProduct, isColoringPageProduct, isPortraitProduct } from '../../types/product';
import type { BraceletOrderDetails, ColoringPageOrderDetails, PortraitOrderDetails } from '../../types/order';
import { VALIDATION } from '../../lib/constants';
import OrderStepper from '../../components/order/OrderStepper';
import Button from '../../components/ui/Button';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import ColorPicker from '../../components/ui/ColorPicker';
import FileUpload from '../../components/ui/FileUpload';
import EmptyState from '../../components/shared/EmptyState';

export default function CustomizePage() {
  const navigate = useNavigate();
  const { state, updateOrderDetails, setStep } = useOrder();
  const { selectedProduct, orderDetails } = state;
  
  // Image upload hook
  const { upload: uploadImage, isUploading, error: uploadError } = useImageUpload();

  // Local state for form fields
  const [colors, setColors] = useState<string[]>(
    (orderDetails as BraceletOrderDetails)?.colors || []
  );
  const [notes, setNotes] = useState(
    (orderDetails as BraceletOrderDetails)?.notes || ''
  );
  const [coloringInstructions, setColoringInstructions] = useState(
    (orderDetails as ColoringPageOrderDetails)?.coloring_instructions || ''
  );
  const [subjectDescription, setSubjectDescription] = useState(
    (orderDetails as PortraitOrderDetails)?.subject_description || ''
  );
  const [selectedSize, setSelectedSize] = useState(
    (orderDetails as PortraitOrderDetails)?.size || ''
  );
  const [selectedStyle, setSelectedStyle] = useState(
    (orderDetails as PortraitOrderDetails)?.style || ''
  );
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(
    (orderDetails as PortraitOrderDetails)?.reference_image_url || null
  );
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    (orderDetails as PortraitOrderDetails)?.reference_image_url || null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if no product selected
  useEffect(() => {
    if (!selectedProduct) {
      navigate('/');
    }
  }, [selectedProduct, navigate]);

  if (!selectedProduct) {
    return (
      <EmptyState
        icon="🛒"
        title="No Product Selected"
        description="Please select a product first!"
        actionLabel="Browse Products"
        actionPath="/"
      />
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (isBraceletProduct(selectedProduct)) {
      if (colors.length === 0) {
        newErrors.colors = 'Please pick at least one color for your bracelet!';
      }
    }

    if (isColoringPageProduct(selectedProduct)) {
      if (!coloringInstructions.trim()) {
        newErrors.coloringInstructions = "Tell us how you'd like us to color this page!";
      }
    }

    if (isPortraitProduct(selectedProduct)) {
      if (!subjectDescription.trim()) {
        newErrors.subjectDescription = "Please describe what you'd like us to draw!";
      }
      if (selectedProduct.portrait.requires_upload && !referenceFile && !referencePreview) {
        newErrors.referenceImage = 'Please upload a reference photo.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Update order details based on product type
      if (isBraceletProduct(selectedProduct)) {
        updateOrderDetails({
          type: 'bracelet',
          product_id: selectedProduct.product_id,
          product_title: selectedProduct.title,
          style: selectedProduct.bracelet.style,
          colors,
          notes: notes.trim() || undefined,
        } as BraceletOrderDetails);
      }

      if (isColoringPageProduct(selectedProduct)) {
        updateOrderDetails({
          type: 'coloring_page',
          product_id: selectedProduct.product_id,
          product_title: selectedProduct.title,
          book_name: selectedProduct.coloring_page.book_name,
          page_name: selectedProduct.coloring_page.page_name,
          coloring_instructions: coloringInstructions.trim(),
        } as ColoringPageOrderDetails);
      }

      if (isPortraitProduct(selectedProduct)) {
        // Upload image if we have a new file that hasn't been uploaded yet
        let imageUrl = uploadedImageUrl;
        
        if (referenceFile && !uploadedImageUrl) {
          const url = await uploadImage(referenceFile);
          if (!url) {
            setErrors((prev) => ({ 
              ...prev, 
              referenceImage: uploadError || "Couldn't upload your photo. Please try again." 
            }));
            setIsProcessing(false);
            return;
          }
          imageUrl = url;
          setUploadedImageUrl(url);
        }

        updateOrderDetails({
          type: 'portrait',
          product_id: selectedProduct.product_id,
          product_title: selectedProduct.title,
          subject_description: subjectDescription.trim(),
          reference_image_url: imageUrl || '',
          size: selectedSize || undefined,
          style: selectedStyle || undefined,
        } as PortraitOrderDetails);
      }

      setStep('contact');
      navigate('/order/contact');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setReferenceFile(file);
    setReferencePreview(URL.createObjectURL(file));
    setUploadedImageUrl(null); // Clear uploaded URL when new file selected
    setErrors((prev) => ({ ...prev, referenceImage: '' }));
  };

  const handleFileClear = () => {
    setReferenceFile(null);
    setReferencePreview(null);
    setUploadedImageUrl(null);
  };

  return (
    <div className="max-w-xl mx-auto">
      <OrderStepper currentStep="customize" />

      {/* Product summary */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 flex items-center gap-4">
        <img
          src={selectedProduct.thumbnail_url}
          alt={selectedProduct.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h2 className="font-semibold text-gray-800">{selectedProduct.title}</h2>
          <p className="text-sm text-gray-500">{selectedProduct.short_desc}</p>
        </div>
      </div>

      <h1 className="text-2xl font-display text-gray-800 mb-6">
        Customize Your Order
      </h1>

      {/* Bracelet customization */}
      {isBraceletProduct(selectedProduct) && (
        <div className="space-y-6">
          <div>
            <label className="label">Style</label>
            <p className="text-gray-800 capitalize">
              {selectedProduct.bracelet.style.replace('_', ' ')}
            </p>
          </div>

          <div>
            <label className="label">
              Pick Your Colors
              {selectedProduct.bracelet.max_colors && (
                <span className="font-normal text-gray-500">
                  {' '}(up to {selectedProduct.bracelet.max_colors})
                </span>
              )}
            </label>
            <ColorPicker
              colors={selectedProduct.bracelet.color_options}
              selected={colors}
              onChange={(newColors) => {
                setColors(newColors);
                setErrors((prev) => ({ ...prev, colors: '' }));
              }}
              maxColors={selectedProduct.bracelet.max_colors}
              error={errors.colors}
            />
          </div>

          <Textarea
            label="Special Requests (optional)"
            placeholder="Any special requests? Let us know!"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={VALIDATION.notes.maxLength}
            hint="Tell us if you want a specific pattern or anything special."
          />
        </div>
      )}

      {/* Coloring page customization */}
      {isColoringPageProduct(selectedProduct) && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Book</label>
              <p className="text-gray-800">{selectedProduct.coloring_page.book_name}</p>
            </div>
            <div>
              <label className="label">Page</label>
              <p className="text-gray-800">{selectedProduct.coloring_page.page_name}</p>
            </div>
          </div>

          <Textarea
            label="How would you like us to color this?"
            placeholder="Example: Please use bright colors! Make the sky pink and the grass purple..."
            value={coloringInstructions}
            onChange={(e) => {
              setColoringInstructions(e.target.value);
              setErrors((prev) => ({ ...prev, coloringInstructions: '' }));
            }}
            maxLength={VALIDATION.description.maxLength}
            error={errors.coloringInstructions}
          />
        </div>
      )}

      {/* Portrait customization */}
      {isPortraitProduct(selectedProduct) && (
        <div className="space-y-6">
          {selectedProduct.portrait.style_options && (
            <Select
              label="Portrait Style"
              options={selectedProduct.portrait.style_options.map((s) => ({
                value: s,
                label: s,
              }))}
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              placeholder="Select a style..."
            />
          )}

          {selectedProduct.portrait.size_options && (
            <Select
              label="Size"
              options={selectedProduct.portrait.size_options.map((s) => ({
                value: s,
                label: s,
              }))}
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              placeholder="Select a size..."
            />
          )}

          <Textarea
            label="Describe what you'd like us to draw"
            placeholder="Example: My golden retriever named Max sitting in the grass..."
            value={subjectDescription}
            onChange={(e) => {
              setSubjectDescription(e.target.value);
              setErrors((prev) => ({ ...prev, subjectDescription: '' }));
            }}
            maxLength={VALIDATION.description.maxLength}
            error={errors.subjectDescription}
          />

          {selectedProduct.portrait.requires_upload && (
            <FileUpload
              label="Reference Photo"
              onFileSelect={handleFileSelect}
              onFileClear={handleFileClear}
              currentFile={referenceFile}
              previewUrl={referencePreview}
              error={errors.referenceImage}
            />
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex gap-4">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          disabled={isProcessing || isUploading}
          className="flex-1"
        >
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          isLoading={isProcessing || isUploading}
          disabled={isProcessing || isUploading}
          className="flex-1"
        >
          {isUploading ? 'Uploading...' : 'Next: Contact Info'}
        </Button>
      </div>
    </div>
  );
}

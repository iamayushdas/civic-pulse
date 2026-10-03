'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, MapPin, Camera, User, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/brutal/Button';
import { Card, CardContent, CardHeader } from '@/components/brutal/Card';
import { Input, Textarea } from '@/components/brutal/Input';
import { Select } from '@/components/brutal/Select';
import { CATEGORY_LABELS, ComplaintCategory } from '@/types';

const LocationPicker = lazy(() => import('@/components/map/LocationPicker'));

const STEPS = ['WHAT', 'WHERE', 'DETAILS', 'CONTACT', 'REVIEW'] as const;
type Step = typeof STEPS[number];

export default function ReportPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    category: '' as ComplaintCategory | '',
    title: '',
    description: '',
    images: [] as string[],
    location: { lat: 28.6139, lng: 77.2090, address: '' },
    area: '',
    ward: '',
    pincode: '',
    anonymous: false,
    citizenName: '',
    citizenPhone: '',
    citizenEmail: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const fetchPincodeDetails = async (pincode: string) => {
    if (!/^\d{6}$/.test(pincode)) return;
    
    setPincodeLoading(true);
    try {
      const response = await fetch(`/api/pincode/${pincode}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          area: data.area || prev.area,
          ward: data.ward || prev.ward,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch pincode details:', error);
    } finally {
      setPincodeLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.category) newErrors.category = 'Please select a category';
    }
    
    if (step === 1) {
      if (!formData.area) newErrors.area = 'Please enter your area';
    }
    
    if (step === 2) {
      if (!formData.title || formData.title.length < 10) {
        newErrors.title = 'Title must be at least 10 characters';
      }
      if (!formData.description || formData.description.length < 20) {
        newErrors.description = 'Description must be at least 20 characters';
      }
    }
    
    if (step === 3 && !formData.anonymous) {
      if (!formData.citizenName || formData.citizenName.length < 2) {
        newErrors.citizenName = 'Please enter your name';
      }
      if (formData.citizenPhone && !/^\d{10}$/.test(formData.citizenPhone)) {
        newErrors.citizenPhone = 'Phone must be 10 digits';
      }
      if (formData.citizenEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.citizenEmail)) {
        newErrors.citizenEmail = 'Invalid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit complaint');
      }

      const data = await response.json();
      setSubmittedId(data.complaintId);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit complaint. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (submittedId) {
    return (
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto">
          <Card variant="accent" className="text-civic-white">
            <CardContent className="py-12 text-center">
              <CheckCircle2 size={64} className="mx-auto mb-6" />
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                COMPLAINT REGISTERED
              </h1>
              <div className="text-5xl sm:text-6xl font-bold font-mono mb-6">
                {submittedId}
              </div>
              <p className="text-lg mb-8">
                Save this ID to track your complaint.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="white"
                  size="lg"
                  onClick={() => router.push(`/complaints/${submittedId}`)}
                >
                  VIEW COMPLAINT
                  <ArrowRight size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => router.push('/')}
                  className="!text-white !border-white hover:!bg-white hover:!text-civic-accent"
                >
                  GO HOME
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 border-2 flex items-center justify-center font-bold text-sm ${
                    index <= currentStep
                      ? 'bg-civic-accent text-civic-white border-civic-accent'
                      : 'bg-civic-white text-civic-black border-civic-black'
                  }`}
                >
                  {index + 1}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      index < currentStep ? 'bg-civic-accent' : 'bg-civic-black'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="label-mono text-center">
            STEP {currentStep + 1} / {STEPS.length} — {STEPS[currentStep]}
          </div>
        </div>

        <Card>
          <CardHeader>
            <h1 className="text-2xl sm:text-3xl font-bold">
              {currentStep === 0 && "WHAT'S WRONG?"}
              {currentStep === 1 && 'WHERE?'}
              {currentStep === 2 && 'DETAILS'}
              {currentStep === 3 && 'CONTACT'}
              {currentStep === 4 && 'REVIEW'}
            </h1>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 0: Category */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.keys(CATEGORY_LABELS) as ComplaintCategory[]).map((category) => (
                  <button
                    key={category}
                    onClick={() => setFormData({ ...formData, category })}
                    className={`p-6 border-2 font-bold text-left transition-all ${
                      formData.category === category
                        ? 'bg-civic-accent text-civic-white border-civic-accent shadow-brutal'
                        : 'bg-civic-white text-civic-black border-civic-black hover:shadow-brutal-sm'
                    }`}
                  >
                    {CATEGORY_LABELS[category].toUpperCase()}
                  </button>
                ))}
                {errors.category && (
                  <p className="text-civic-accent font-medium text-sm col-span-full">
                    {errors.category}
                  </p>
                )}
              </div>
            )}

            {/* Step 1: Location */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <Suspense fallback={
                  <div className="w-full h-64 flex items-center justify-center bg-civic-bg border-2 border-civic-black">
                    <div className="text-center">
                      <div className="inline-block w-12 h-12 border-4 border-civic-black border-t-civic-accent rounded-full animate-spin mb-4"></div>
                      <p className="font-bold uppercase text-sm">Loading Map...</p>
                    </div>
                  </div>
                }>
                  <LocationPicker
                    location={formData.location}
                    onLocationChange={(location) => {
                      setFormData({ ...formData, location });
                    }}
                  />
                </Suspense>
                
                <Input
                  label="AREA / LOCALITY *"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="e.g., Connaught Place"
                  error={errors.area}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="WARD"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="Optional"
                  />
                  <Input
                    label="PINCODE"
                    value={formData.pincode}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, pincode: value });
                      if (/^\d{6}$/.test(value)) {
                        fetchPincodeDetails(value);
                      }
                    }}
                    onBlur={(e) => {
                      if (/^\d{6}$/.test(e.target.value)) {
                        fetchPincodeDetails(e.target.value);
                      }
                    }}
                    placeholder="110001"
                    maxLength={6}
                    suffix={pincodeLoading ? <Loader2 size={16} className="animate-spin" /> : undefined}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <Input
                  label="TITLE *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Brief description of the problem"
                  error={errors.title}
                />
                
                <Textarea
                  label="DESCRIPTION *"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information about the issue..."
                  error={errors.description}
                  rows={6}
                />

                <div>
                  <label className="block label-mono mb-2">PHOTOS (OPTIONAL)</label>
                  <div className="border-2 border-dashed border-civic-black p-8 text-center bg-civic-bg">
                    <Camera size={48} className="mx-auto mb-4 text-civic-muted" />
                    <p className="text-civic-muted font-medium mb-2">
                      Photo upload placeholder
                    </p>
                    <p className="text-sm text-civic-muted">
                      Up to 5 images
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contact */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-civic-bg border-2 border-civic-black p-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.anonymous}
                      onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                      className="w-6 h-6 border-2 border-civic-black"
                    />
                    <span className="font-bold">SUBMIT ANONYMOUSLY</span>
                  </label>
                  <p className="text-sm text-civic-muted mt-2 ml-9">
                    You won't receive updates, but your complaint will still be processed.
                  </p>
                </div>

                {!formData.anonymous && (
                  <>
                    <Input
                      label="YOUR NAME *"
                      value={formData.citizenName}
                      onChange={(e) => setFormData({ ...formData, citizenName: e.target.value })}
                      placeholder="Full name"
                      error={errors.citizenName}
                    />
                    
                    <Input
                      label="PHONE NUMBER"
                      value={formData.citizenPhone}
                      onChange={(e) => setFormData({ ...formData, citizenPhone: e.target.value })}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      error={errors.citizenPhone}
                    />
                    
                    <Input
                      label="EMAIL ADDRESS"
                      type="email"
                      value={formData.citizenEmail}
                      onChange={(e) => setFormData({ ...formData, citizenEmail: e.target.value })}
                      placeholder="your.email@example.com"
                      error={errors.citizenEmail}
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="label-mono mb-2">CATEGORY</div>
                    <div className="font-bold">
                      {formData.category && CATEGORY_LABELS[formData.category]}
                    </div>
                  </div>
                  <div>
                    <div className="label-mono mb-2">LOCATION</div>
                    <div className="font-bold">{formData.area}</div>
                    {formData.pincode && (
                      <div className="text-sm text-civic-muted">{formData.pincode}</div>
                    )}
                  </div>
                </div>

                <div className="border-t-2 border-civic-black pt-6">
                  <div className="label-mono mb-2">TITLE</div>
                  <div className="font-bold">{formData.title}</div>
                </div>

                <div className="border-t-2 border-civic-black pt-6">
                  <div className="label-mono mb-2">DESCRIPTION</div>
                  <div className="leading-relaxed">{formData.description}</div>
                </div>

                {!formData.anonymous && formData.citizenName && (
                  <div className="border-t-2 border-civic-black pt-6">
                    <div className="label-mono mb-2">CONTACT</div>
                    <div className="font-bold">{formData.citizenName}</div>
                    {formData.citizenPhone && (
                      <div className="text-sm">{formData.citizenPhone}</div>
                    )}
                    {formData.citizenEmail && (
                      <div className="text-sm">{formData.citizenEmail}</div>
                    )}
                  </div>
                )}

                {formData.anonymous && (
                  <div className="bg-civic-bg border-2 border-civic-black p-4">
                    <p className="text-sm font-medium">
                      ⚠ This complaint will be submitted anonymously
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <div className="flex justify-between gap-4 p-4 sm:p-6 border-t-2 border-civic-black">
            {currentStep > 0 && (
              <Button variant="ghost" onClick={handleBack} disabled={isSubmitting}>
                <ArrowLeft size={20} />
                BACK
              </Button>
            )}
            
            <div className="ml-auto">
              {currentStep < STEPS.length - 1 ? (
                <Button variant="primary" onClick={handleNext}>
                  NEXT
                  <ArrowRight size={20} />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT COMPLAINT'}
                  <ArrowRight size={20} />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, MapPin, Camera, User, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/brutal/Button';
import { Card, CardContent, CardHeader } from '@/components/brutal/Card';
import { Input, Textarea } from '@/components/brutal/Input';
import { Select } from '@/components/brutal/Select';
import { CATEGORY_LABELS, COMPLAINT_CATEGORIES, ComplaintCategory } from '@/types';

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
        body: JSON.stringify({
          ...formData,
          ward: formData.ward || undefined,
          pincode: formData.pincode || undefined,
          citizenName: formData.citizenName || undefined,
          citizenPhone: formData.citizenPhone || undefined,
          citizenEmail: formData.citizenEmail || undefined,
        }),
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
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#fef9c3_0%,_#f3f4f6_35%,_#dbeafe_100%)] px-4 py-12 sm:py-20">
        <div className="absolute -left-8 top-12 h-24 w-24 rotate-12 border-4 border-black bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
        <div className="absolute right-6 top-20 h-20 w-20 border-4 border-black bg-red-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />

        <div className="relative mx-auto max-w-2xl">
          <div className="card-brutal relative border-4 border-black bg-white p-8 text-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] sm:p-12">
            <div className="absolute -right-3 -top-3 h-8 w-8 border-4 border-black bg-lime-400" />
            <div className="text-center">
              <div className="mb-6 inline-flex items-center justify-center rounded-none border-4 border-black bg-lime-400 p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 size={54} className="text-black" />
              </div>
              <h1 className="mb-4 text-3xl font-black uppercase tracking-[-0.08em] sm:text-5xl">
                COMPLAINT REGISTERED
              </h1>
              <div className="mb-6 border-4 border-black bg-black px-4 py-3 text-4xl font-black tracking-[0.12em] text-yellow-300 sm:text-6xl">
                {submittedId}
              </div>
              <p className="mb-8 text-lg font-bold uppercase tracking-wide text-black/70">
                Save this ID to track your complaint.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
                  className="!border-black !text-black hover:!bg-black hover:!text-white"
                >
                  GO HOME
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#fef9c3_0%,_#f3f4f6_35%,_#dbeafe_100%)] px-4 py-8 sm:py-12">
      <div className="absolute -left-8 top-10 h-28 w-28 rotate-12 border-4 border-black bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
      <div className="absolute right-8 top-16 h-20 w-20 border-4 border-black bg-red-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
      <div className="absolute bottom-6 left-10 h-24 w-24 border-4 border-black bg-lime-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 border-4 border-black bg-black px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-300 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              REPORT ISSUE
            </div>
            <h1 className="text-4xl font-black uppercase leading-none tracking-[-0.08em] text-black sm:text-5xl">
              SPEAK UP.
            </h1>
          </div>
          <div className="inline-flex items-center gap-2 border-4 border-black bg-pink-400 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            CITY FIXED ONE REPORT AT A TIME
          </div>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center ${index < STEPS.length - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center border-2 text-sm font-bold ${
                      index <= currentStep
                        ? 'border-civic-accent bg-civic-accent text-civic-white'
                        : 'border-civic-black bg-civic-white text-civic-black'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 ${
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

          <div className="card-brutal relative bg-white p-1 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <Card className="overflow-hidden">
              <CardHeader className="border-b-4 border-black bg-yellow-300">
                <h1 className="text-2xl font-black uppercase tracking-[-0.06em] text-black sm:text-3xl">
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
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {COMPLAINT_CATEGORIES.map((category) => (
                      <button
                        key={category}
                        onClick={() => setFormData({ ...formData, category })}
                        className={`border-2 p-6 text-left font-bold transition-all ${
                          formData.category === category
                            ? 'border-civic-accent bg-civic-accent text-civic-white shadow-brutal'
                            : 'border-civic-black bg-civic-white text-civic-black hover:shadow-brutal-sm'
                        }`}
                      >
                        {CATEGORY_LABELS[category].toUpperCase()}
                      </button>
                    ))}
                    {errors.category && (
                      <p className="col-span-full text-sm font-medium text-civic-accent">
                        {errors.category}
                      </p>
                    )}
                  </div>
                )}

                {/* Step 1: Location */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <Suspense fallback={
                      <div className="flex h-64 w-full items-center justify-center border-2 border-civic-black bg-civic-bg">
                        <div className="text-center">
                          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-civic-black border-t-civic-accent" />
                          <p className="text-sm font-bold uppercase">Loading Map...</p>
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

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      <label className="mb-2 block label-mono">PHOTOS (OPTIONAL)</label>
                      <div className="border-2 border-dashed border-civic-black bg-civic-bg p-8 text-center">
                        <Camera size={48} className="mx-auto mb-4 text-civic-muted" />
                        <p className="mb-2 font-medium text-civic-muted">Photo upload placeholder</p>
                        <p className="text-sm text-civic-muted">Up to 5 images</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="border-2 border-civic-black bg-civic-bg p-6">
                      <label className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.anonymous}
                          onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                          className="h-6 w-6 border-2 border-civic-black"
                        />
                        <span className="font-bold">SUBMIT ANONYMOUSLY</span>
                      </label>
                      <p className="ml-9 mt-2 text-sm text-civic-muted">
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
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                      <div className="border-2 border-civic-black bg-civic-bg p-4">
                        <p className="text-sm font-medium">
                          ⚠ This complaint will be submitted anonymously
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              <div className="flex justify-between gap-4 border-t-4 border-black bg-white p-4 sm:p-6">
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
      </div>
    </div>
  );
}

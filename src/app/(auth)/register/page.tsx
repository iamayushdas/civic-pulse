'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/brutal/AuthProvider';
import { Input } from '@/components/brutal/Input';
import { BrutalButton } from '@/components/brutal/BrutalButton';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone || undefined,
      });
      router.push('/'); // Redirect to home after successful registration
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-civic-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card-brutal p-8">
          <div className="mb-8">
            <h1 className="heading-brutal text-3xl mb-2">REGISTER</h1>
            <p className="text-civic-text-secondary">
              Create your civic pulse account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-civic-accent/10 border-4 border-civic-accent">
              <p className="text-sm font-medium text-civic-accent">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="FULL NAME"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              disabled={loading}
            />

            <Input
              label="EMAIL"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
              disabled={loading}
            />

            <Input
              label="PHONE (OPTIONAL)"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              pattern="[0-9]{10}"
              disabled={loading}
            />

            <Input
              label="PASSWORD"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              required
              disabled={loading}
            />

            <Input
              label="CONFIRM PASSWORD"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              disabled={loading}
            />

            <BrutalButton
              type="submit"
              variant="primary"
              loading={loading}
              block
            >
              {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
            </BrutalButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-civic-text-secondary">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-civic-primary hover:underline"
              >
                LOGIN
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-civic-text-secondary hover:text-civic-primary"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_#fef9c3_0%,_#f3f4f6_35%,_#dbeafe_100%)] px-4 py-10">
      <div className="absolute -left-8 top-10 h-32 w-32 rotate-12 border-4 border-black bg-yellow-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
      <div className="absolute right-6 top-20 h-20 w-20 border-4 border-black bg-red-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
      <div className="absolute bottom-10 left-12 h-24 w-24 border-4 border-black bg-lime-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />

      <div className="relative mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden md:flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 border-4 border-black bg-black px-3 py-2 text-xs font-black uppercase tracking-[0.2em] text-yellow-300 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            JOIN US
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-black uppercase leading-none tracking-[-0.08em] text-black lg:text-7xl">
              BUILD.
            </h1>
            <h1 className="text-5xl font-black uppercase leading-none tracking-[-0.08em] text-black lg:text-7xl">
              REPORT.
            </h1>
            <h1 className="inline-block -rotate-2 border-4 border-black bg-cyan-400 px-3 py-2 text-5xl font-black uppercase leading-none tracking-[-0.08em] text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] lg:text-7xl">
              IMPACT.
            </h1>
          </div>

          <p className="max-w-md text-lg font-bold uppercase leading-relaxed text-black">
            Create your account. Start raising issues. Push for change.
          </p>
        </div>

        <div className="w-full max-w-md justify-self-center md:justify-self-end">
          <div className="card-brutal relative bg-white p-7 sm:p-8">
            <div className="absolute -right-3 -top-3 h-8 w-8 border-4 border-black bg-yellow-300" />

            <div className="mb-7 space-y-3">
              <div className="inline-block border-4 border-black bg-pink-400 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                REGISTER
              </div>
              <h2 className="text-3xl font-black uppercase tracking-[-0.08em] text-black">
                CREATE ACCOUNT
              </h2>
              <p className="text-sm font-bold uppercase tracking-wide text-black/70">
                Join the civic pulse community
              </p>
            </div>

            {error && (
              <div className="mb-6 border-4 border-black bg-red-500 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-sm font-black uppercase tracking-wide text-white">{error}</p>
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
              <p className="text-sm font-bold uppercase tracking-wide text-black/70">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="font-black text-red-500 underline underline-offset-4"
                >
                  LOGIN
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 border-4 border-black bg-white px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:translate-y-1"
            >
              ← BACK TO HOME
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

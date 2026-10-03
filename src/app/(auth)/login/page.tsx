'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/brutal/AuthProvider';
import { Input } from '@/components/brutal/Input';
import { BrutalButton } from '@/components/brutal/BrutalButton';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/'); // Redirect to home after successful login
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-civic-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card-brutal p-8">
          <div className="mb-8">
            <h1 className="heading-brutal text-3xl mb-2">LOGIN</h1>
            <p className="text-civic-text-secondary">
              Access your civic pulse account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-civic-accent/10 border-4 border-civic-accent">
              <p className="text-sm font-medium text-civic-accent">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="EMAIL"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required
              disabled={loading}
            />

            <Input
              label="PASSWORD"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />

            <BrutalButton
              type="submit"
              variant="primary"
              loading={loading}
              block
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </BrutalButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-civic-text-secondary">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-bold text-civic-primary hover:underline"
              >
                REGISTER
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

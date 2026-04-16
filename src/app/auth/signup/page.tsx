'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthLayout from '@/components/AuthLayout';
import { SignUpSchema } from '@/lib/validationSchemas';

type SignUpForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(SignUpSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        if (response.status === 409) {
          setErrorMessage('An account with this email already exists. Please sign in or use a different email.');
        } else {
          setErrorMessage(result.message || 'Error creating account. Please try again.');
        }
        return;
      }

      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/add');
        return;
      }

      setErrorMessage('Account created successfully, but login failed. Please sign in manually.');
    } catch {
      setErrorMessage('Error creating account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'signin' | 'signup') => {
    if (tab === 'signin') {
      router.push('/auth/signin');
    }
  };

  return (
    <AuthLayout activeTab="signup" onTabChange={handleTabChange}>
      <form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage && (
          <div className="auth-alert auth-alert-danger">
            <span>{errorMessage}</span>
            <button
              type="button"
              className="auth-alert-close"
              onClick={() => setErrorMessage('')}
            >
              ×
            </button>
          </div>
        )}

        <div className="auth-form-group">
          <label className="auth-form-label">Full Name</label>
          <input
            type="text"
            {...register('fullName')}
            className={`auth-form-input ${errors.fullName ? 'is-invalid' : ''}`}
            placeholder="Your full name"
          />
          {errors.fullName && <div className="auth-error">{errors.fullName.message}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">UH Email Address</label>
          <input
            type="email"
            {...register('email')}
            className={`auth-form-input ${errors.email ? 'is-invalid' : ''}`}
            placeholder="student@hawaii.edu"
          />
          {errors.email && <div className="auth-error">{errors.email.message}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Password</label>
          <div className="auth-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`auth-form-input ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Create a password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'hide' : 'show'}
            </button>
          </div>
          {errors.password && <div className="auth-error">{errors.password.message}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Confirm Password</label>
          <div className="auth-input-wrap">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className={`auth-form-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 'hide' : 'show'}
            </button>
          </div>
          {errors.confirmPassword && <div className="auth-error">{errors.confirmPassword.message}</div>}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignUp;

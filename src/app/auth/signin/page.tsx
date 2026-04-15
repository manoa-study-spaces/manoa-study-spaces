'use client';

import { signIn } from 'next-auth/react';
import type { SignInResponse } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { SignInSchema } from '@/lib/validationSchemas';

type SignInForm = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

function getSignInErrorMessage(result: SignInResponse | undefined): string {
  if (result?.code === 'user_not_found') {
    return 'No account found with that email address.';
  }

  if (result?.code === 'invalid_password') {
    return 'Incorrect password. Please try again.';
  }

  if (result?.error?.includes('CredentialsSignin')) {
    return 'Invalid email or password. Please try again.';
  }

  return 'An error occurred during sign in. Please try again.';
}

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: yupResolver(SignInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(getSignInErrorMessage(result));
        return;
      }

      if (result?.ok) {
        router.push('/list');
        return;
      }

      setErrorMessage(getSignInErrorMessage(result));
    } catch {
      setErrorMessage('An unexpected error occurred during sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: 'signin' | 'signup') => {
    if (tab === 'signup') {
      router.push('/auth/signup');
    }
  };

  return (
    <AuthLayout activeTab="signin" onTabChange={handleTabChange}>
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
              placeholder="Enter your password"
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

        <div className="auth-row">
          <label className="auth-check-wrap">
            <input type="checkbox" {...register('rememberMe')} />
            Remember me
          </label>
          <a href="/auth/forgot-password" className="auth-forgot-btn">
            Forgot password?
          </a>
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignIn;

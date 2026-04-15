'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';

type ForgotPasswordForm = {
  email: string;
};

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('UH email is required')
      .email('Email is invalid')
      .matches(/^[^\s@]+@hawaii\.edu$/, 'Please use your UH email address (@hawaii.edu).'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    setSubmitted(true);
    setIsLoading(false);
  };

  const handleTabChange = (tab: 'signin' | 'signup') => {
    if (tab === 'signin') {
      router.push('/auth/signin');
    }
    if (tab === 'signup') {
      router.push('/auth/signup');
    }
  };

  return (
    <AuthLayout activeTab="signin" onTabChange={handleTabChange}>
      <h2 className="auth-page-title">Forgot Password?</h2>
      <p className="auth-page-subtitle">Email reset is not enabled yet. Enter your UH email and we will notify you once this is available.</p>

      {submitted && (
        <div className="auth-alert auth-alert-success">
          <span>Thanks. Password reset by email is currently unavailable.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-form-group">
          <label className="auth-form-label">UH Email address</label>
          <input
            type="email"
            {...register('email')}
            className={`auth-form-input ${errors.email ? 'is-invalid' : ''}`}
            placeholder="student@hawaii.edu"
          />
          {errors.email && <div className="auth-error">{errors.email.message}</div>}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <button type="button" className="auth-secondary-btn" onClick={() => router.push('/auth/signin')}>
        Back to Log in
      </button>
    </AuthLayout>
  );
};

export default ForgotPassword;
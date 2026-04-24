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
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  major?: string;
  standing?: 'Freshman' | 'Sophmore' | 'Junior' | 'Senior' | 'Graduate' | 'Other';
  interests?: string;
  classes?: string;
  pictureUrl?: string;
  status?: string[];
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
  } = useForm<any>({
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
      username: data.username,
            email: data.email,
            password: data.password,
            major: data.major || null,
            standing: data.standing || null,
            interests: data.interests || null,
            classes: data.classes || null,
      pictureUrl: data.pictureUrl || null,
            status: data.status && data.status.length ? data.status : null,
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

      // Save profile info to localStorage as a temporary fallback (no DB changes requested)
      try {
        if (typeof window !== 'undefined') {
                const profile = {
            fullName: data.fullName,
                  username: data.username,
            email: data.email,
            major: data.major || '',
            standing: data.standing || '',
            interests: data.interests || '',
                classes: data.classes || '',
                pictureUrl: data.pictureUrl || '',
                status: Array.isArray(data.status) ? data.status : (data.status ? [data.status] : []),
          };
          // Use a key tied to the user's email so profile page can pick it up later
          window.localStorage.setItem(`profile:${data.email}`, JSON.stringify(profile));
        }
      } catch (e) {
        // ignore localStorage errors
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
          <label className="auth-form-label">Name</label>
          <input
            type="text"
            {...register('fullName')}
            className={`auth-form-input ${errors.fullName ? 'is-invalid' : ''}`}
            placeholder="Enter your name"
          />
          {errors.fullName && <div className="auth-error">{String(errors.fullName?.message)}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Username</label>
          <input
            type="text"
            {...register('username')}
            className={`auth-form-input ${errors.username ? 'is-invalid' : ''}`}
            placeholder="Enter a username"
          />
          {errors.username && <div className="auth-error">{String(errors.username?.message)}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">UH Email Address</label>
          <input
            type="email"
            {...register('email')}
            className={`auth-form-input ${errors.email ? 'is-invalid' : ''}`}
            placeholder="student@hawaii.edu"
          />
          {errors.email && <div className="auth-error">{String(errors.email?.message)}</div>}
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
          {errors.password && <div className="auth-error">{String(errors.password?.message)}</div>}
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
          {errors.confirmPassword && <div className="auth-error">{String(errors.confirmPassword?.message)}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Major</label>
          <input
            type="text"
            {...register('major')}
            className={`auth-form-input ${errors.major ? 'is-invalid' : ''}`}
            placeholder="e.g., BS Computer Science"
          />
          {errors.major && <div className="auth-error">{String(errors.major?.message)}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Standing</label>
          <select {...register('standing')} className={`auth-form-input ${errors.standing ? 'is-invalid' : ''}`}>
            <option value="">Select standing</option>
            <option value="Freshman">Freshman</option>
            <option value="Sophmore">Sophmore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
            <option value="Graduate">Graduate</option>
            <option value="Other">Other</option>
          </select>
          {errors.standing && <div className="auth-error">{String(errors.standing?.message)}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Interests</label>
          <textarea
            {...register('interests')}
            className={`auth-form-input ${errors.interests ? 'is-invalid' : ''}`}
            placeholder="List your interests/hobbies (e.g., reading, research, running)"
            rows={3}
          />
          {errors.interests && <div className="auth-error">{String(errors.interests?.message)}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Classes</label>
          <textarea
            {...register('classes')}
            className={`auth-form-input ${errors.classes ? 'is-invalid' : ''}`}
            placeholder="List classes you're taking (e.g., ICS 111, MATH 241, PHYS 151)"
            rows={2}
          />
          {errors.classes && <div className="auth-error">{String(errors.classes?.message)}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Profile Picture (optional)</label>
          <input
            type="url"
            {...register('pictureUrl')}
            className={`auth-form-input ${errors.pictureUrl ? 'is-invalid' : ''}`}
            placeholder="Optional image URL for your profile"
          />
          {errors.pictureUrl && <div className="auth-error">{String(errors.pictureUrl?.message)}</div>}
        </div>

        <div className="auth-form-group">
          <label className="auth-form-label">Status — select any that apply</label>
          <div className="status-options">
            {[
              'Open to studying with a group',
              'Open to meeting new people',
              'Prefer studying alone',
              'Looking for study space recommendations',
              'Currently studying for a specific test, lesson, or class',
            ].map((opt) => (
              <label key={opt} className="status-option">
                <input
                  type="checkbox"
                  value={opt}
                  {...register('status')}
                />
                <span className="status-pill">{opt}</span>
              </label>
            ))}
          </div>
          {errors.status && <div className="auth-error">{String((errors.status as any)?.message)}</div>}
        </div>

        

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignUp;

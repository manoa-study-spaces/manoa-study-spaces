import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const SignUpSchema = Yup.object({
  fullName: Yup.string().required('Full name is required').min(2, 'Full name must be at least 2 characters'),
  email: Yup.string()
    .required('UH email is required')
    .email('Email is invalid')
    .matches(/^[^\s@]+@hawaii\.edu$/, 'Only @hawaii.edu addresses are accepted'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  username: Yup.string()
    .required('Username is required')
    .matches(/^[a-zA-Z0-9_]{3,30}$/, 'Username must be 3-30 characters and contain only letters, numbers, and underscores'),
  major: Yup.string().optional().max(100, 'Major must be 100 characters or less'),
  standing: Yup.string()
    .oneOf(['Freshman', 'Sophmore', 'Junior', 'Senior', 'Graduate', 'Other'])
    .optional(),
  interests: Yup.string().optional().max(500, 'Interests must be 500 characters or less'),
  classes: Yup.string().optional().max(500, 'Classes must be 500 characters or less'),
  pictureUrl: Yup.string().optional().url('Picture must be a valid URL'),
  status: Yup.array()
    .of(
      Yup.string().oneOf([
        'Open to studying with a group',
        'Open to meeting new people',
        'Prefer studying alone',
        'Looking for study space recommendations',
        'Currently studying for a specific test, lesson, or class',
      ]),
    )
    .optional(),
});

export const SignInSchema = Yup.object({
  email: Yup.string().required('UH email is required').email('Email is invalid'),
  password: Yup.string().required('Password is required'),
});
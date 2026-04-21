import * as Yup from 'yup';

export const AddSpaceSchema = Yup.object({
  buildingName: Yup.string().required('Building name is required'),
  roomNumber: Yup.string().required('Room number is required'),
  occupancy: Yup.string().oneOf(['Empty', 'Moderate', 'Crowded']).required(),
  foodAllowed: Yup.string().oneOf(['Permitted', 'Prohibited', 'Water']).required(),
  noiseLevel: Yup.string().oneOf(['Quiet', 'Moderate', 'Loud']).required(),
  image: Yup.string().optional(),
});

export type AddSpaceFormValues = {
  buildingName: string;
  roomNumber: string;
  occupancy: 'Empty' | 'Moderate' | 'Crowded';
  foodAllowed: 'Permitted' | 'Prohibited' | 'Water';
  noiseLevel: 'Quiet' | 'Moderate' | 'Loud';
  image?: string;
};

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
});

export const SignInSchema = Yup.object({
  email: Yup.string().required('UH email is required').email('Email is invalid'),
  password: Yup.string().required('Password is required'),
});

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

export const AddListingSchema = Yup.object({
  id: Yup.number().required(),
  buildingName: Yup.string().required(),
  roomNumber: Yup.string().required(),
  times: Yup.string().required(),
  pictures: Yup.string().required(),
  occupancy: Yup.string().required(),
  foodAllowed: Yup.string().required(),
  noiseLevel: Yup.string().required(),
  amenities: Yup.string().required(),
  spaceType: Yup.string().required(),
  capacity: Yup.number().positive().required(), 
});

export const EditListingSchema = Yup.object({
  id: Yup.number().required(),
  buildingName: Yup.string().required(),
  roomNumber: Yup.string().required(),
  times: Yup.string().required(),
  pictures: Yup.string().required(),
  occupancy: Yup.string().required(),
  foodAllowed: Yup.string().required(),
  noiseLevel: Yup.string().required(),
  amenities: Yup.string().required(),
  spaceType: Yup.string().required(),
  capacity: Yup.number().positive().required(), 
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


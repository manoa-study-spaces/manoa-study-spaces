import * as Yup from 'yup';
import { Amenity, FoodAllowed, NoiseLevel, Occupancy, SpaceType } from '@prisma/client';

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
  listingID: Yup.number().required(),
  buildingName: Yup.string().required(),
  roomNumber: Yup.string().required(),
  times: Yup.object({
    timeID: Yup.number().required(),
    listingID: Yup.number().required(),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
  }).required(),
  image: Yup.mixed<FileList>()
    .test('minFiles', 'At least one photo is required', (value) => value && value.length >= 1)
    .test('maxFiles', 'You can upload at most 9 photos', (value) => value && value.length <= 9)
    .test('validFileTypes', 'Only JPG and PNG formats are allowed', (value) => {
      if (!value) {
        return false;
      }
      for (let i = 0; i < value.length; ++i) {
        const file = value[i];
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
          return false;
        }
      }

      return true;
    }),
  occupancy: Yup.string().oneOf(Object.values(Occupancy)).required('How busy is the space?'),
  foodAllowed: Yup.string().oneOf(Object.values(FoodAllowed)).required('Is food allowed in the space?'),
  noiseLevel:Yup.string().oneOf(Object.values(NoiseLevel)).required('How noisy is the space?'),
  amenity: Yup.string().oneOf(Object.values(Amenity)).required('What amenities are available?'),
  spaceType: Yup.string().oneOf(Object.values(SpaceType)).required('What type of space is it?'),
  capacity: Yup.number().positive().required(), 
});

export const EditListingSchema = Yup.object({
  listingID: Yup.number().required(),
  buildingName: Yup.string().required(),
  roomNumber: Yup.string().required(),
  times: Yup.object({
    timeID: Yup.number().required(),
    listingID: Yup.number().required(),
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),
  }).required(),
  image: Yup.mixed<FileList>()
    .test('minFiles', 'At least one photo is required', (value) => value && value.length >= 1)
    .test('maxFiles', 'You can upload at most 9 photos', (value) => value && value.length <= 9)
    .test('validFileTypes', 'Only JPG and PNG formats are allowed', (value) => {
      if (!value) {
        return false;
      }
      for (let i = 0; i < value.length; ++i) {
        const file = value[i];
        if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
          return false;
        }
      }

      return true;
    }),
  occupancy: Yup.string().oneOf(Object.values(Occupancy)).required('How busy is the space?'),
  foodAllowed: Yup.string().oneOf(Object.values(FoodAllowed)).required('Is food allowed in the space?'),
  noiseLevel:Yup.string().oneOf(Object.values(NoiseLevel)).required('How noisy is the space?'),
  amenity: Yup.string().oneOf(Object.values(Amenity)).required('What amenities are available?'),
  spaceType: Yup.string().oneOf(Object.values(SpaceType)).required('What type of space is it?'),
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

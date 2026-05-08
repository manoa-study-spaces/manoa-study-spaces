import * as Yup from 'yup';

export const AddSpaceSchema = Yup.object({
  buildingName: Yup.string().required('Building name is required'),
  roomNumber: Yup.string().required('Room number is required'),
  occupancy: Yup.string().oneOf(['Empty', 'Moderate', 'Crowded']).required('Occupancy is required'),
  foodAllowed: Yup.string().oneOf(['Permitted', 'Prohibited', 'Water']).required('Food selection is required'),
  noiseLevel: Yup.string().oneOf(['Quiet', 'Moderate', 'Loud']).required('Noise level is required'),
  spaceType: Yup.string().oneOf(['Indoor', 'Outdoor']).required(),
  capacity: Yup.number().min(1).required(),
  image: Yup.string().notRequired(),
  amenities: Yup.array()
    .of(Yup.string().oneOf([
      'Outlets',
      'AirConditioning',
      'WiFi',
      'Printing',
      'Whiteboards',
      'ReservableRooms',
      'Accessible',
      'WaterRefill',
    ]))
    .default([]),
});

export const AddStudyGroupSchema = Yup.object({
  title: Yup.string().required('Title is required').max(100),
  course: Yup.string().required('Course is required').max(100),
  description: Yup.string().optional().max(500),
  location: Yup.string().required('Location is required'),
  startTime: Yup.date()
    .required('Start time is required')
    .min(new Date(), 'Start time must be in the future'),
  endTime: Yup.date()
    .required('End time is required')
    .min(Yup.ref('startTime'), 'End time must be after start time'),
  capacity: Yup.number()
    .required('Capacity is required')
    .min(1, 'Must allow at least 1 person')
    .max(50, 'Too large'),
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
  major: Yup.string()
    .required("Major is required. Use 'Exploratory' if major is not declared")
    .max(100, 'Major must be 100 characters or less'),
  standing: Yup.string()
    .oneOf(['Freshman', 'Sophmore', 'Junior', 'Senior', 'Graduate', 'Other'], 'Please select one of the following')
    .optional(),
  interests: Yup.string().optional().max(500, 'Interests must be 500 characters or less'),
  classes: Yup.string().optional().max(500, 'Classes must be 500 characters or less'),
  pictureUrl: Yup.string()
    .optional()
    .test('is-url-or-datauri', 'Picture must be a valid URL or image upload', (value) => {
      if (!value) return true;
      const isDataUri = /^data:image\/.+;base64,/.test(value);
      if (isDataUri) return true;
      try {
        // validate as URL
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
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
    .transform((value, originalValue) => {
      // some form serializers send unchecked multi-select fields as `false` instead of an empty array
      // transform `false` into an empty array so Yup treats it as an empty selection instead of throwing an array type error
      if (originalValue === false) return [];
      return value;
    })
    .optional(),
});

export const SignInSchema = Yup.object({
  email: Yup.string().required('UH email is required').email('Email is invalid'),
  password: Yup.string().required('Password is required'),
});

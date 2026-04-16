import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  buildingName: Yup.string().required(),
  roomNumber: Yup.string(),
  times:
  pictures:
  occupancy: Yup.string().oneOf(['empty', 'moderate', 'crowded']).required(),
  foodAllowed: Yup.string().oneOf(['permitted', 'prohibited', 'water okay']).required(),
  noiseLevel: Yup.string().oneOf(['quiet', 'moderate', 'loud']).required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});
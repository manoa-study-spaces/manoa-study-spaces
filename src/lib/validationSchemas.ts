import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  buildingName: Yup.string().required(),
  roomNumber: Yup.string(),
  times:


  pictures: Yup.mixed<FileList>()
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
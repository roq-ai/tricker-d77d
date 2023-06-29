import * as yup from 'yup';

export const photoValidationSchema = yup.object().shape({
  original_photo: yup.string().required(),
  enhanced_photo: yup.string(),
  user_id: yup.string().nullable(),
});

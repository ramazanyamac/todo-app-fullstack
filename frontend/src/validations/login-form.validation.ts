import yup from '@/plugins/yup';

export const LoginFormValidation = yup.object({
  username: yup.string().min(3).max(20).required(),
  password: yup.string().min(6).required(),
});

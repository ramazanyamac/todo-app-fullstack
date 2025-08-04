import yup from '@/plugins/yup';

export const RegisterFormValidation = yup.object({
  username: yup.string().min(3).max(20).required(),
  email: yup
    .string()
    .email()
    .matches(/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,999}|[0-9]{1,3})(\]?)$/)
    .required(),
  password: yup.string().min(6).required(),
});

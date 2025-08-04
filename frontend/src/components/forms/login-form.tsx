'use client';

import yup from '@/plugins/yup';
import { useLocale, useTranslations } from 'next-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/custom/submit-button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { toast } from 'sonner';
import { LoginFormValidation } from '@/validations/login-form.validation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';

export function LoginForm() {
  const t = useTranslations();
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const form = useForm<yup.InferType<typeof LoginFormValidation>>({
    resolver: yupResolver(LoginFormValidation),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: yup.InferType<typeof LoginFormValidation>) {
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        callbackUrl: '/',
        redirect: false,
        locale
      });

      if (result?.error) {
        toast.error(t('response.login-error'));
      } else if (result?.ok) {
        toast.success(t('response.login-success'));
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
    } catch (error) {
      toast.error(t('response.server-error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{t('form.label.username')}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{t('form.label.password')}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton
          className="w-full shrink-1"
          text={t('form.button.login')}
          loadingText={t('form.button.loading')}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}

'use client';

import yup from '@/plugins/yup';
import { useLocale, useTranslations } from 'next-intl';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/custom/submit-button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { toast } from 'sonner';
import { RegisterFormValidation } from '@/validations/register-form.validation';
import { useState } from 'react';

export function RegisterForm() {
  const t = useTranslations();
  const userLang = useLocale();
  const [loading, setLoading] = useState(false);

  const form = useForm<yup.InferType<typeof RegisterFormValidation>>({
    resolver: yupResolver(RegisterFormValidation),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: yup.InferType<typeof RegisterFormValidation>) {
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Accept-Language': userLang,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await res.json();

      if (res.ok && responseData.success) {
        toast.success(responseData.message);
        // Redirect to login page after successful registrations
        setTimeout(() => {
          window.location.href = '/?auth=login';
        }, 1000);
      } else {
        toast.error(responseData.message);
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
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>{t('form.label.email')}</FormLabel>
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
          text={t('form.button.register')}
          loadingText={t('form.button.loading')}
          loading={loading}
        />
      </form>
    </FormProvider>
  );
}

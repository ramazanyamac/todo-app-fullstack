import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'tr'] as string[];

export const defaultLocale = 'en';

export const localePrefix = 'as-needed';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
});

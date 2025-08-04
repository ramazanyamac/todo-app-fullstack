import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { transformKeys } from '@/lib/transformKeys';

export default getRequestConfig(async ({ requestLocale }) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  const localeFile = (await import(`@/messages/${locale}.json`)).default;

  const messages = transformKeys(localeFile);

  return {
    locale,
    messages,
  };
});

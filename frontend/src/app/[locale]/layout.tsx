import '@/styles/globals.css';

import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from '@/components/ui/sonner';
import { CookiesProvider } from 'next-client-cookies/server';
import { Header } from '@/components/custom/header';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Geist } from 'next/font/google';
import SessionProvider from '@/components/providers/session-provider';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { ThemeProvider } from '@/components/providers/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <SessionProvider session={session}>
            <CookiesProvider>
              <NextIntlClientProvider>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  <Header />
                  <main className="w-full">{children}</main>
                  <Toaster richColors />
                </ThemeProvider>
              </NextIntlClientProvider>
            </CookiesProvider>
          </SessionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

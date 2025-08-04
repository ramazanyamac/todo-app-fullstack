'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { ModeToggle } from '@/components/custom/mode-toggle';
import { SelectLanguage } from '@/components/custom/select-language';
import Link from 'next/link';

export function Header() {
  const t = useTranslations();
  const { data: session } = useSession();
  const siteTitle = process.env.NEXT_PUBLIC_SITE_TITLE;

  const handleLogout = async () => {
    await signOut({
      redirect: false,
      callbackUrl: '/',
    });

    window.location.href = '/';
  };

  return (
    <header className="bg-muted border-gray-200 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">{siteTitle}</span>
        </Link>
        <div className="flex items-center gap-2">
          <SelectLanguage />
          {session?.user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-foreground">
                {t('component.header.welcome')}, {session.user.username}
              </span>
              <Button onClick={handleLogout} className="hidden md:inline-flex">
                {t('component.header.button.logout')}
              </Button>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

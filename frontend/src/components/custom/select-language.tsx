'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { defaultLocale, locales } from '@/i18n/routing';
import { useCookies } from 'next-client-cookies';

const languageList = [
  {
    title: 'English',
    code: 'en',
  },
  {
    title: 'Turkish',
    code: 'tr',
  },
];

export function SelectLanguage() {
  const cookies = useCookies();
  const selectedLang = cookies.get('NEXT_LOCALE') || defaultLocale;
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  const updateLanguage = (lang: string) => {
    cookies.set('NEXT_LOCALE', lang);
    let currentPath = window.location.pathname;

    const pathSegments = currentPath.split('/').filter(Boolean);

    if (locales.includes(pathSegments[0] as any)) {
      pathSegments.shift();
    }

    const newPath = `/${lang}/${pathSegments.join('/')}`;
    window.location.href = newPath === `/${lang}/` ? `/${lang}` : newPath;
  };

  return (
    <div className="flex items-center space-x-1 md:space-x-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[120px] py-2 px-4 justify-between border-0 shadow-none"
          >
            {selectedLang ? (
              <>
                {languageList.find((languageList) => languageList.code === selectedLang)?.title}
                {languageList.find((languageList) => languageList.code === selectedLang)?.code === 'en' ? (
                  <EnglishIcon />
                ) : (
                  <TurkishIcon />
                )}
              </>
            ) : null}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[120px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                {languageList.map((languageList, index) => (
                  <CommandItem
                    className="justify-between"
                    key={index}
                    value={languageList.code}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                      updateLanguage(currentValue);
                    }}
                    disabled={languageList.code === selectedLang}
                  >
                    {languageList.title}
                    {languageList.code === 'en' ? <EnglishIcon /> : <TurkishIcon />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function EnglishIcon() {
  return (
    <svg
      className="w-5 h-5 rounded-full"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 3900 3900"
    >
      <path fill="#b22234" d="M0 0h7410v3900H0z" />
      <path d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0" stroke="#fff" strokeWidth="300" />
      <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
      <g fill="#fff">
        <g id="d">
          <g id="c">
            <g id="e">
              <g id="b">
                <path id="a" d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z" />
                <use xlinkHref="#a" y="420" />
                <use xlinkHref="#a" y="840" />
                <use xlinkHref="#a" y="1260" />
              </g>
              <use xlinkHref="#a" y="1680" />
            </g>
            <use xlinkHref="#b" x="247" y="210" />
          </g>
          <use xlinkHref="#c" x="494" />
        </g>
        <use xlinkHref="#d" x="988" />
        <use xlinkHref="#c" x="1976" />
        <use xlinkHref="#e" x="2470" />
      </g>
    </svg>
  );
}

function TurkishIcon() {
  return (
    <svg className="w-5 h-5 rounded-full" xmlns="http://www.w3.org/2000/svg" id="flag-icons-tr" viewBox="0 0 640 480">
      <g fillRule="evenodd">
        <path fill="#e30a17" d="M0 0h640v480H0z" />
        <path
          fill="#fff"
          d="M407 247.5c0 66.2-54.6 119.9-122 119.9s-122-53.7-122-120 54.6-119.8 122-119.8 122 53.7 122 119.9"
        />
        <path
          fill="#e30a17"
          d="M413 247.5c0 53-43.6 95.9-97.5 95.9s-97.6-43-97.6-96 43.7-95.8 97.6-95.8 97.6 42.9 97.6 95.9z"
        />
        <path
          fill="#fff"
          d="m430.7 191.5-1 44.3-41.3 11.2 40.8 14.5-1 40.7 26.5-31.8 40.2 14-23.2-34.1 28.3-33.9-43.5 12-25.8-37z"
        />
      </g>
    </svg>
  );
}

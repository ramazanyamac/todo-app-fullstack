import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generatePageTitle(title?: string) {
  const baseTitle = process?.env?.NEXT_PUBLIC_SITE_TITLE ? process?.env?.NEXT_PUBLIC_SITE_TITLE + ' ' : '';
  return `${baseTitle} - ${title}`;
}

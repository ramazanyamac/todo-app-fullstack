import { Metadata } from 'next';
import { generatePageTitle } from '@/lib/utils';
import UserForm from '@/components/forms/user-form';
import { getTranslations } from 'next-intl/server';

export interface PageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: generatePageTitle(t('page.homepage.title')),
    description: t('page.homepage.description'),
  };
}

export default async function HomePage() {
  return <UserForm />;
}

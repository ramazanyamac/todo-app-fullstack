import { Metadata } from 'next';
import { generatePageTitle } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import { TodoList } from '@/components/custom/todolist';

export interface PageProps {
  params: { locale: string; slug: string };
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();

  return {
    title: generatePageTitle(t('page.dashboard.title')),
    description: t('page.dashboard.description'),
  };
}

export default async function DashboardPage() {
  return <TodoList />;
}

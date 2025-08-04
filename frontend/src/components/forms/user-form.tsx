'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RegisterForm } from './register-form';
import { LoginForm } from './login-form';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

const UserForm: React.FC = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('auth') === 'login' ? 'login' : 'register';

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 mx-auto mt-6">
      <Tabs defaultValue={defaultTab} className="gap-6">
        <TabsList>
          <TabsTrigger value="register">{t('component.user-form.tab.register')}</TabsTrigger>
          <TabsTrigger value="login">{t('component.user-form.tab.login')}</TabsTrigger>
        </TabsList>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserForm;

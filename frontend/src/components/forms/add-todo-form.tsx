import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from 'next-intl';

interface AddTodoFormProps {
  onAdd: (title: string, description: string, due_date: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

export function AddTodoForm({ onAdd, loading, error, onClose }: AddTodoFormProps) {
  const t = useTranslations();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAdd(title, desc, due);
    setTitle('');
    setDesc('');
    setDue('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder={t('component.todolist.dialog.input.title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        placeholder={t('component.todolist.dialog.input.description')}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <Input
        type="date"
        placeholder={t('component.todolist.dialog.input.due-date')}
        value={due}
        onChange={(e) => setDue(e.target.value)}
      />
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? t('component.todolist.dialog.button.adding') : t('component.todolist.dialog.button.add')}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          {t('component.todolist.dialog.button.close')}
        </Button>
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </form>
  );
}

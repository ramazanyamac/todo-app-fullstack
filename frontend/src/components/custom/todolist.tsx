'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import { useLocale, useTranslations } from 'next-intl';
import { AddTodoForm } from '@/components/forms/add-todo-form';
import { EditTodoForm } from '@/components/forms/edit-todo-form';
import { useSession } from 'next-auth/react';

interface Todo {
  todo_id: number;
  title: string;
  description?: string;
  completed: boolean;
  due_date?: string;
}

export function TodoList() {
  const t = useTranslations();
  const userLang = useLocale();
  const { data: session } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTodos() {
      if (!session?.accessToken) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const token = session.accessToken;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
          headers: token ? { 'Accept-Language': userLang, Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) {
          setTodos(data.todos || []);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(t('response.server-error'));
      }
      setLoading(false);
    }
    fetchTodos();
  }, [userLang, session?.accessToken, t]);

  const handleDelete = async (todo_id: number) => {
    const token = session?.accessToken;
    if (!window.confirm('Bu görevi silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${todo_id}`, {
        method: 'DELETE',
        headers: token ? { 'Accept-Language': userLang, Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setTodos((prev) => prev.filter((todo) => todo.todo_id !== todo_id));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('response.server-error'));
    }
  };

  const handleAddTodo = async (title: string, description: string, due_date: string) => {
    setAddLoading(true);
    setAddError(null);
    const token = session?.accessToken;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Accept-Language': userLang, Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          description,
          due_date: due_date || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.todo) {
        setTodos((prev) => [data.todo, ...prev]);
        setOpen(false);
      } else {
        setAddError(data.message);
      }
    } catch (err) {
      setAddError(t('response.server-error'));
    }
    setAddLoading(false);
  };

  const openEditDialog = (todo: Todo) => {
    setEditTodo(todo);
    setEditOpen(true);
  };

  const handleEditTodo = async (title: string, description: string, due_date: string) => {
    if (!editTodo) return;
    setEditLoading(true);
    setEditError(null);
    const token = session?.accessToken;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${editTodo.todo_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Accept-Language': userLang, Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          description,
          due_date: due_date || null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.todo) {
        setTodos((prev) => prev.map((todo) => (todo.todo_id === editTodo.todo_id ? data.todo : todo)));
        setEditOpen(false);
        setEditTodo(null);
      } else {
        setEditError(data.message);
      }
    } catch (err) {
      setEditError(t('response.server-error'));
    }
    setEditLoading(false);
  };

  const handleToggleCompleted = async (todo: Todo) => {
    const token = session?.accessToken;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/todos/${todo.todo_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Accept-Language': userLang, Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      const data = await res.json();
      if (res.ok && data.todo) {
        setTodos((prev) => prev.map((t) => (t.todo_id === todo.todo_id ? data.todo : t)));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(t('response.server-error'));
    }
  };

  if (loading) return <div className="text-center mt-8">{t('component.todolist.loading')}</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!session) return <div className="text-center mt-8">{t('component.loading')}</div>;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-16 mx-auto max-w-4xl">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">{t('component.todolist.button.trigger')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('component.todolist.dialog.task.title')}</DialogTitle>
            <DialogDescription>{t('component.todolist.dialog.task.description')}</DialogDescription>
          </DialogHeader>
          <AddTodoForm onAdd={handleAddTodo} loading={addLoading} error={addError} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('component.todolist.dialog.task.update-title')}</DialogTitle>
            <DialogDescription>{t('component.todolist.dialog.task.description')}</DialogDescription>
          </DialogHeader>
          <EditTodoForm
            todo={editTodo}
            onEdit={handleEditTodo}
            loading={editLoading}
            error={editError}
            onClose={() => {
              setEditOpen(false);
              setEditTodo(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <tbody>
          {todos.length === 0 && (
            <tr>
              <td className="px-6 py-4" colSpan={3}>
                {t('component.todolist.result.noitem')}
              </td>
            </tr>
          )}
          {todos.map((todo) => {
            const isOverdue = todo.due_date && dayjs(todo.due_date).isBefore(dayjs(), 'day');
            const isCompleted = todo.completed;
            const strike = isCompleted || isOverdue;
            return (
              <tr
                key={todo.todo_id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleCompleted(todo)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </td>
                <th
                  scope="row"
                  className={`px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white ${strike ? 'line-through text-gray-400' : ''}`}
                >
                  {todo.title}
                </th>
                <td className="flex items-center justify-end px-6 py-4">
                  <span className="text-xs text-gray-400 mr-4">{todo.due_date ? `Bitiş: ${todo.due_date}` : ''}</span>
                  <button
                    type="button"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() => openEditDialog(todo)}
                  >
                    {t('component.todolist.table.edit')}
                  </button>
                  <button
                    type="button"
                    className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                    onClick={() => handleDelete(todo.todo_id)}
                  >
                    {t('component.todolist.table.remove')}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

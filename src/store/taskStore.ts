import type { TasksResponse } from '@/types/api';
import { create } from 'zustand';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface TaskState {
  data: TasksResponse | null;
  loading: boolean;
  error: string | null;
  fetchTasks: (taskId?: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>(set => ({
  data: null,
  loading: false,
  error: null,

  async fetchTasks(taskId?: number) {
    set({ loading: true, error: null });

    try {
      const url = taskId ? `${API_BASE_URL}?task_id=${taskId}` : API_BASE_URL;
      const resp = await fetch(url);

      if (!resp.ok) throw new Error('Возможно задачи с таким ID не существует, попробуйте ввести другой ID');

      const json: TasksResponse = await resp.json();

      set({ data: json });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Неизвестная ошибка, пожалуйста попробуйте перезагрузить страницу',
        data: null,
      });
    } finally {
      set({ loading: false });
    }
  },
}));

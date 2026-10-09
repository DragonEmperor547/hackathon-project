import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { NOTICES, SEED_READ_IDS } from '@/data/notices';
import { buildSeedTasks } from '@/data/seedTasks';
import { newId } from '@/lib/ids';
import type { Task, ThemeMode } from '@/types';

interface AppState {
  tasks: Task[];
  readNoticeIds: string[];
  themeMode: ThemeMode;
  hasHydrated: boolean;

  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'status' | 'completedAt'>) => string;
  updateTask: (id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  markNoticeRead: (id: string) => void;
  markAllNoticesRead: () => void;
  setThemeMode: (m: ThemeMode) => void;
  resetDemo: () => void;
}

type Persisted = Pick<AppState, 'tasks' | 'readNoticeIds' | 'themeMode'>;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: buildSeedTasks(new Date()),
      readNoticeIds: SEED_READ_IDS,
      themeMode: 'system',
      hasHydrated: false,

      addTask: (input) => {
        const id = newId();
        const task: Task = { ...input, id, status: 'pending', createdAt: new Date().toISOString() };
        set((s) => ({ tasks: [task, ...s.tasks] }));
        return id;
      },

      updateTask: (id, patch) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),

      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== id) return t;
            if (t.status === 'pending') {
              return { ...t, status: 'completed', completedAt: new Date().toISOString() };
            }
            const { completedAt: _, ...rest } = t;
            return { ...rest, status: 'pending' };
          }),
        })),

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      markNoticeRead: (id) => {
        if (get().readNoticeIds.includes(id)) return;
        set((s) => ({ readNoticeIds: [...s.readNoticeIds, id] }));
      },

      markAllNoticesRead: () =>
        set({ readNoticeIds: NOTICES.map((n) => n.id) }),

      setThemeMode: (themeMode) => set({ themeMode }),

      resetDemo: () => set({ tasks: buildSeedTasks(new Date()), readNoticeIds: SEED_READ_IDS }),
    }),
    {
      name: 'campus-companion', // never rename: that wipes saved data
      version: 1, // bump when the persisted shape changes, and default new fields in migrate
      migrate: (persisted) => persisted as Persisted,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s): Persisted => ({ tasks: s.tasks, readNoticeIds: s.readNoticeIds, themeMode: s.themeMode }),
      onRehydrateStorage: () => () => useAppStore.setState({ hasHydrated: true }),
    },
  ),
);

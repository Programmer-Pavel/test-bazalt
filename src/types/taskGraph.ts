import type { Task, BranchCommit } from './api';

export interface TaskCell {
  hasTask: boolean;
}

export interface TaskRow {
  task: Task;
  date: string;
  displayDate: string;
  showDate: boolean; // показывать дату только для первой строки в группе
  commits: BranchCommit[];
  cells: Record<string, TaskCell>;
}

import type { TasksResponse, BranchCommit } from '../types/api';
import type { TaskRow, TaskCell } from '../types/taskGraph';

const formatDate = (dateStr: string): { date: string; displayDate: string } => {
  const dateObj = new Date(dateStr);

  return {
    date: dateObj.toISOString().split('T')[0],
    displayDate: dateObj.toLocaleString('ru-RU'),
  };
};

export const buildTaskRows = ({ branches, tasks, branch_commits }: TasksResponse): TaskRow[] => {
  // Группируем коммиты по задачам
  const commitsByTask = new Map<number, BranchCommit[]>();

  branch_commits.forEach(commit => {
    if (!commitsByTask.has(commit.task)) {
      commitsByTask.set(commit.task, []);
    }

    const { displayDate } = formatDate(commit.date);

    // Форматируем дату коммита
    const formattedCommit = {
      ...commit,
      date: displayDate,
    };

    commitsByTask.get(commit.task)!.push(formattedCommit);
  });

  // Создаем пустые ячейки для всех веток
  const emptyCells = (): Record<string, TaskCell> => {
    const cells: Record<string, TaskCell> = {};

    branches.forEach(branch => {
      cells[branch] = { hasTask: false };
    });
    return cells;
  };

  // Создаем строки для всех задач
  const rows: TaskRow[] = tasks.map(task => {
    const cells = emptyCells();
    const taskCommits = commitsByTask.get(task.id) || [];
    const { date, displayDate } = formatDate(task.date);

    // Отмечаем, что задача находится в своей ветке
    if (cells[task.branch]) {
      cells[task.branch].hasTask = true;
    }

    return {
      task,
      date,
      displayDate,
      showDate: false,
      commits: taskCommits,
      cells,
    };
  });

  // Устанавливаем showDate=true для первой строки каждой даты
  let lastDate = '';

  rows.forEach(row => {
    if (row.date !== lastDate) {
      row.showDate = true;
      lastDate = row.date;
    }
  });

  return rows;
};

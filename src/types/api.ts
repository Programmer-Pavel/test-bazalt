export interface Task {
  id: number;
  prev: number;
  branch: string;
  date: string;
}

export interface BranchCommit {
  name: string;
  date: string;
  task: number;
}

export interface TasksResponse {
  branches: string[];
  tasks: Task[];
  branch_commits: BranchCommit[];
}

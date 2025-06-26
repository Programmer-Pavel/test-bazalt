import type { TasksResponse } from '@/types/api';
import type { TaskRow } from '@/types/taskGraph';
import { BranchCell } from './BranchCell';

interface TaskRowComponentProps {
  virtualRow: { index: number; start: number; size: number };
  row: TaskRow;
  nextRow: TaskRow | undefined;
  branchCount: number;
  branchColor: Record<string, string>;
  branchBounds: Record<string, { first: number; last: number }>;
  data: TasksResponse;
}

export const TaskRowComponent = ({
  virtualRow,
  row,
  nextRow,
  branchCount,
  branchColor,
  branchBounds,
  data,
}: TaskRowComponentProps) => {
  const isLastOfDate = !nextRow || nextRow.date !== row.date;

  return (
    <div
      className="absolute top-0 left-0 w-full"
      style={{
        transform: `translateY(${virtualRow.start}px)`,
        height: virtualRow.size,
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `100px repeat(${branchCount}, 1fr)`,
          height: 48,
        }}
      >
        <div className="flex items-center justify-center bg-red-100 text-sm whitespace-nowrap border-r border-gray-300">
          {row.showDate ? row.date : ''}
        </div>
        {data.branches.map(br => (
          <BranchCell
            key={br}
            cell={row.cells[br]}
            color={branchColor[br]}
            firstRow={branchBounds[br].first}
            lastRow={branchBounds[br].last}
            idx={virtualRow.index}
            row={row}
          />
        ))}
      </div>
      {isLastOfDate && <div className="absolute bottom-0 left-0 w-full h-px bg-gray-400" />}
    </div>
  );
};

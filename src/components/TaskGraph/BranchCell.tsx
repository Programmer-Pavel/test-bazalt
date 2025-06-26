import type { TaskCell, TaskRow } from '@/types/taskGraph';
import { Tooltip } from '@patternfly/react-core';

interface TooltipContentProps {
  row: TaskRow;
}

const TooltipContent = ({ row }: TooltipContentProps) => (
  <div className="text-xs leading-tight">
    <div className="mb-3">
      <b>Задача ID: {row.task.id}</b>
    </div>
    <div className="text-start mb-1">Дата: {row.displayDate}</div>
    <div className="text-start mb-1">Ветка: {row.task.branch}</div>
    {row.task.prev && <div className="text-start mb-2">Предыдущая: {row.task.prev}</div>}
    <div className="text-start">Коммиты:</div>
    {row.commits.length === 0 ? (
      <div className="mt-1 italic text-gray-400">Нет коммитов</div>
    ) : (
      <ul className="mt-1 list-disc">
        {row.commits.map(c => (
          <li key={`${c.name}-${c.date}`}>
            — {c.name} ({c.date})
          </li>
        ))}
      </ul>
    )}
  </div>
);

interface BranchCellProps {
  cell: TaskCell;
  color: string;
  firstRow: number;
  lastRow: number;
  idx: number;
  row: TaskRow;
}

export const BranchCell = ({ cell, color, firstRow, lastRow, idx, row }: BranchCellProps) => {
  let lineTop: string | undefined;
  let lineBottom: string | undefined;

  const hasMany = firstRow !== -1 && firstRow !== lastRow;

  if (hasMany && idx >= firstRow && idx <= lastRow) {
    lineTop = idx === firstRow ? '50%' : '0%';
    lineBottom = idx === lastRow ? '50%' : '0%';
  }

  return (
    <div className="relative flex justify-center items-center min-w-28 h-full">
      {lineTop !== undefined && (
        <div
          className="absolute left-1/2 w-0.5 -translate-x-1/2"
          style={{
            backgroundColor: color,
            top: lineTop,
            bottom: lineBottom,
          }}
        />
      )}
      {cell.hasTask && (
        <div className="relative w-full h-full">
          <Tooltip content={<TooltipContent row={row} />}>
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full cursor-pointer"
              style={{ backgroundColor: color }}
            />
          </Tooltip>
          <span className="absolute top-1/2 -translate-y-1/2 right-1/2 text-xs mr-2">{row.task.id}</span>
        </div>
      )}
    </div>
  );
};

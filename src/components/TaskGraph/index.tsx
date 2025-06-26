import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { GraphHeader } from './GraphHeader';
import { TaskRowComponent } from './TaskRowComponent';
import type { TasksResponse } from '@/types/api';
import { branchPalette } from '@/constants/branchPalette';
import type { TaskRow } from '@/types/taskGraph';
import { buildTaskRows } from '@/utils/taskGraphRows';

interface Props {
  data: TasksResponse;
}

export const TaskGraph = ({ data }: Props) => {
  const [containerHeight, setContainerHeight] = useState(600);

  const parentRef = useRef<HTMLDivElement>(null);

  const branchCount = data.branches.length;

  const rows = useMemo<TaskRow[]>(() => buildTaskRows(data), [data]);

  const branchColor = useMemo(() => {
    const m: Record<string, string> = {};
    data.branches.forEach((b, i) => (m[b] = branchPalette[i % branchPalette.length]));
    return m;
  }, [data.branches]);

  const branchBounds = useMemo(() => {
    const bounds: Record<string, { first: number; last: number }> = {};

    data.branches.forEach(b => (bounds[b] = { first: -1, last: -1 }));

    rows.forEach((row, idx) => {
      data.branches.forEach(br => {
        if (row.cells[br].hasTask) {
          if (bounds[br].first === -1) bounds[br].first = idx;
          bounds[br].last = idx;
        }
      });
    });

    return bounds;
  }, [rows, data.branches]);

  useLayoutEffect(() => {
    const top = parentRef.current?.getBoundingClientRect().top ?? 0;
    const GAP = 20;
    setContainerHeight(window.innerHeight - top - GAP);
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 8,
  });

  return (
    <div className="flex flex-col">
      <div
        ref={parentRef}
        className="relative overflow-auto"
        style={{ height: containerHeight }}
      >
        {/* шапка */}
        <GraphHeader
          branches={data.branches}
          branchCount={branchCount}
        />

        {/* тело */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const row = rows[virtualRow.index];
            const nextRow = rows[virtualRow.index + 1];

            return (
              <TaskRowComponent
                key={`${row.date}-${virtualRow.index}`}
                virtualRow={virtualRow}
                row={row}
                nextRow={nextRow}
                branchCount={branchCount}
                branchColor={branchColor}
                branchBounds={branchBounds}
                data={data}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

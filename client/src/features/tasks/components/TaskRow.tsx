import { memo } from 'react';
import { PencilIcon, Trash2Icon } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { WeatherBadge } from '@/features/weather';
import type { Task } from '../types';

// ─── Helpers ─────────────────────────────────────────────────

const TAG_COLORS: Record<string, string> = {
  low: 'bg-tag-low text-tag-low-foreground',
  'not urgent': 'bg-tag-low text-tag-low-foreground',
  medium: 'bg-tag-medium text-tag-medium-foreground',
  high: 'bg-tag-high text-tag-high-foreground',
  urgent: 'bg-tag-high text-tag-high-foreground',
};

function tagColorClasses(tag: string): string {
  return TAG_COLORS[tag.toLowerCase()] ?? 'bg-secondary text-secondary-foreground';
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const formatted = new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);
  return due.getTime() === today.getTime() ? `Today - ${formatted}` : formatted;
}

// ─── Shared props ─────────────────────────────────────────────

export interface TaskRowProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// ─── Tag badge ────────────────────────────────────────────────

function TagBadge({ tag }: { tag: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        tagColorClasses(tag),
      )}
    >
      {tag}
    </span>
  );
}

// ─── Action buttons ────────────────────────────────────────────

function RowActions({ task, onEdit, onDelete }: Omit<TaskRowProps, 'onToggle'>) {
  return (
    <div className="flex items-center">
      <Button
        className="cursor-pointer"
        variant="ghost"
        size="icon-sm"
        onClick={() => onEdit(task)}
        aria-label={`Edit ${task.title}`}
      >
        <PencilIcon className="w-4 h-4 text-muted-foreground" />
      </Button>
      <Button
        className="cursor-pointer"
        variant="ghost"
        size="icon-sm"
        onClick={() => onDelete(task)}
        aria-label={`Delete ${task.title}`}
      >
        <Trash2Icon className="w-4 h-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

// ─── Desktop cells ────────────────────────────────────────────

function DesktopRowCells({ task, onToggle, onEdit, onDelete }: TaskRowProps) {
  const firstTag = task.tags[0] ?? null;
  return (
    <>
      <TableCell className="w-10 px-3 py-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task)}
          className="cursor-pointer border-foreground data-checked:border-foreground"
        />
      </TableCell>
      <TableCell className="px-3 py-3 text-sm">
        <span className={task.completed ? 'text-muted-foreground' : ''}>{task.title}</span>
      </TableCell>
      <TableCell className="px-3 py-3 text-sm whitespace-nowrap text-muted-foreground">
        {formatDate(task.dueDate)}
      </TableCell>
      <TableCell className="px-3 py-3">{firstTag && <TagBadge tag={firstTag} />}</TableCell>
      <TableCell className="px-3 py-3">
        {task.weather && <WeatherBadge {...task.weather} />}
      </TableCell>
      <TableCell className="px-3 py-3">
        <RowActions task={task} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </>
  );
}

// ─── Desktop table row ────────────────────────────────────────

export const TaskDesktopRow = memo(function TaskDesktopRow(props: TaskRowProps) {
  return (
    <TableRow>
      <DesktopRowCells {...props} />
    </TableRow>
  );
});

// ─── Mobile card ──────────────────────────────────────────────

export const TaskMobileCard = memo(function TaskMobileCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const firstTag = task.tags[0] ?? null;

  return (
    <div className="flex items-start gap-3 py-4 border-b border-border last:border-0">
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task)}
        className="mt-0.5 border-foreground data-checked:border-foreground"
      />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium',
            task.completed && 'line-through text-muted-foreground',
          )}
        >
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {task.dueDate && (
            <span className="text-xs text-muted-foreground">{formatDate(task.dueDate)}</span>
          )}
          {firstTag && <TagBadge tag={firstTag} />}
          {task.weather && <WeatherBadge {...task.weather} />}
        </div>
      </div>
      <RowActions task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
});

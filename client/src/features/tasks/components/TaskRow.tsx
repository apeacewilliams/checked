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
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ─── Shared props ─────────────────────────────────────────────

interface TaskRowProps {
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

// ─── Desktop table row ────────────────────────────────────────

export function TaskDesktopRow({ task, onToggle, onEdit, onDelete }: TaskRowProps) {
  const firstTag = task.tags[0] ?? null;

  return (
    <TableRow>
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
      <TableCell className="px-3 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {formatDate(task.dueDate)}
      </TableCell>
      <TableCell className="px-3 py-3">{firstTag && <TagBadge tag={firstTag} />}</TableCell>
      <TableCell className="px-3 py-3">
        {task.weather && <WeatherBadge {...task.weather} />}
      </TableCell>
      <TableCell className="px-3 py-3">
        <RowActions task={task} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}

// ─── Mobile card ──────────────────────────────────────────────

export function TaskMobileCard({ task, onToggle, onEdit, onDelete }: TaskRowProps) {
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
}

import { AlignLeftIcon, CalendarIcon, TagIcon } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { EmptyState } from '@/shared/components/EmptyState';
import { TaskDesktopRow, TaskMobileCard } from './TaskRow';
import { TaskForm } from './TaskForm';
import type { TaskFormValues } from './TaskForm';
import type { Task } from '../types';

// ─── Column definitions ───────────────────────────────────────

const COLUMNS = [
  { key: 'name', label: 'Task name', icon: AlignLeftIcon, className: '' },
  { key: 'due', label: 'Due date', icon: CalendarIcon, className: 'w-32' },
  { key: 'tag', label: 'Tag', icon: TagIcon, className: 'w-32' },
  { key: 'note', label: 'Note', icon: AlignLeftIcon, className: 'w-48' },
  { key: 'actions', label: 'Actions', icon: null, className: 'w-20 justify-center' },
] as const;

// ─── Loading skeleton ─────────────────────────────────────────

function DesktopSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={6}>
            <div className="h-4 bg-muted animate-pulse rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function MobileSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-12 bg-muted animate-pulse rounded" />
      ))}
    </div>
  );
}

// ─── Inline create row ────────────────────────────────────────

interface InlineFormProps {
  loading: boolean;
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
}

function DesktopInlineForm({ loading, onSubmit, onCancel }: InlineFormProps) {
  return (
    <TableRow>
      <TableCell />
      <TableCell colSpan={5}>
        <TaskForm onSubmit={onSubmit} onCancel={onCancel} loading={loading} />
      </TableCell>
    </TableRow>
  );
}

function MobileInlineForm({ loading, onSubmit, onCancel }: InlineFormProps) {
  return (
    <div className="py-4 border-t border-border">
      <TaskForm onSubmit={onSubmit} onCancel={onCancel} loading={loading} />
    </div>
  );
}

// ─── TaskTable ────────────────────────────────────────────────

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  showInlineForm?: boolean;
  creating?: boolean;
  onCreateSubmit?: (values: TaskFormValues) => void;
  onCreateCancel?: () => void;
}

export function TaskTable({
  tasks,
  loading,
  onToggle,
  onEdit,
  onDelete,
  showInlineForm = false,
  creating = false,
  onCreateSubmit,
  onCreateCancel,
}: TaskTableProps) {
  const isEmpty = !loading && tasks.length === 0 && !showInlineForm;

  if (isEmpty) {
    return <EmptyState title="No tasks yet" description="Click '+ Add task' to get started" />;
  }

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden rounded-lg border border-border bg-card px-4">
        {loading ? (
          <MobileSkeleton />
        ) : (
          <>
            {tasks.map((task) => (
              <TaskMobileCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {showInlineForm && onCreateSubmit && (
              <MobileInlineForm
                loading={creating}
                onSubmit={onCreateSubmit}
                onCancel={onCreateCancel}
              />
            )}
          </>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block rounded-lg border border-border bg-card overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              {COLUMNS.map(({ key, label, icon: Icon, className }) => (
                <TableHead key={key} className={className}>
                  <span className="flex items-center gap-1.5 text-xs font-normal">
                    {Icon && <Icon className="w-3.5 h-3.5" />}
                    {label}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <DesktopSkeleton />
            ) : (
              <>
                {tasks.map((task) => (
                  <TaskDesktopRow
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
                {showInlineForm && onCreateSubmit && (
                  <DesktopInlineForm
                    loading={creating}
                    onSubmit={onCreateSubmit}
                    onCancel={onCreateCancel}
                  />
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

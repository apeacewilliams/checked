import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { TaskTable } from './TaskTable';
import type { TaskFormValues } from './TaskForm';
import type { Task } from '../types';

// ─── Section ──────────────────────────────────────────────────

interface SectionProps {
  title: string;
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

function TaskSection({
  title,
  tasks,
  loading,
  onToggle,
  onEdit,
  onDelete,
  showInlineForm,
  creating,
  onCreateSubmit,
  onCreateCancel,
}: SectionProps) {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 mb-3">
          <h2 className="text-lg font-bold">{title}</h2>
          {open ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronUpIcon className="w-5 h-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <TaskTable
            tasks={tasks}
            loading={loading}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            showInlineForm={showInlineForm}
            creating={creating}
            onCreateSubmit={onCreateSubmit}
            onCreateCancel={onCreateCancel}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

// ─── TaskSections ─────────────────────────────────────────────

interface TaskSectionsProps {
  tasks: Task[];
  loading: boolean;
  showCreateForm: boolean;
  creating: boolean;
  onCreateSubmit: (values: TaskFormValues) => void;
  onCreateCancel: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (task: Task) => void;
}

export function TaskSections({
  tasks,
  loading,
  showCreateForm,
  creating,
  onCreateSubmit,
  onCreateCancel,
  onEdit,
  onDelete,
  onToggle,
}: TaskSectionsProps) {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-8">
      <TaskSection
        title="Tasks to do"
        tasks={pendingTasks}
        loading={loading}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        showInlineForm={showCreateForm}
        creating={creating}
        onCreateSubmit={onCreateSubmit}
        onCreateCancel={onCreateCancel}
      />
      {(completedTasks.length > 0 || loading) && (
        <TaskSection
          title="Tasks done"
          tasks={completedTasks}
          loading={loading}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}

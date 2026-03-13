import { useState } from 'react';
import { PlusIcon, SearchIcon, LockKeyholeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/authentication';
import { useToast } from '@/features/notifications';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useTasks, useTaskMutations, TaskSections, EditTaskDialog } from '@/features/tasks';
import type { Task, TaskFormValues } from '@/features/tasks';

export function DashboardPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const { logout } = useAuth();
  const { showSuccess } = useToast();

  const { tasks, loading, error } = useTasks(
    debouncedSearch ? { search: debouncedSearch } : undefined,
  );

  const { createTask, creating, updateTask, updating, toggleTask, deleteTask } = useTaskMutations();

  const handleCreate = async ({ title, dueDate, tags }: TaskFormValues) => {
    const result = await createTask({ variables: { input: { title, dueDate, tags } } });
    if (result.data) setShowCreateForm(false);
  };

  const handleUpdate = ({ title, dueDate, tags }: TaskFormValues) => {
    if (!editingTask) return;
    updateTask({
      variables: { id: editingTask.id, input: { title, dueDate, tags } },
      onCompleted: () => {
        showSuccess('Task updated');
        setEditingTask(null);
      },
    });
  };

  const handleDelete = (task: Task) => {
    deleteTask({ variables: { id: task.id } });
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">My Tasks for the next month</h1>

        {/* Search + logout — desktop only (mobile uses the header hamburger menu) */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              name="search"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-60 placeholder:text-foreground/60 placeholder:text-base"
            />
          </div>
          <Button variant="outline" onClick={logout} className="h-11 rounded border-foreground">
            <LockKeyholeIcon className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <Button
        className="mb-16 py-6 px-8"
        onClick={() => setShowCreateForm(true)}
        disabled={showCreateForm}
      >
        <PlusIcon className="w-4 h-4 mr-2" />
        Add task
      </Button>

      {error ? (
        <p className="text-sm text-destructive">Failed to load tasks. Please refresh.</p>
      ) : (
        <TaskSections
          tasks={tasks}
          loading={loading}
          showCreateForm={showCreateForm}
          creating={creating}
          onCreateSubmit={handleCreate}
          onCreateCancel={() => setShowCreateForm(false)}
          onEdit={setEditingTask}
          onDelete={handleDelete}
          onToggle={toggleTask}
        />
      )}

      <EditTaskDialog
        task={editingTask}
        open={Boolean(editingTask)}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null);
        }}
        onSubmit={handleUpdate}
        loading={updating}
      />
    </div>
  );
}

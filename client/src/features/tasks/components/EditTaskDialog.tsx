import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import type { TaskFormValues } from './TaskForm';
import type { Task } from '../types';

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TaskFormValues) => void;
  loading: boolean;
}

export function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onSubmit,
  loading,
}: EditTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
        </DialogHeader>
        {task && (
          <TaskForm
            key={task.id}
            task={task}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            loading={loading}
            showActions
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

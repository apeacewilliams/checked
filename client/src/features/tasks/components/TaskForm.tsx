import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Task } from '../types';

export interface TaskFormValues {
  title: string;
}

interface TaskFormProps {
  task?: Task;
  onSubmit: (values: TaskFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  showActions?: boolean;
}

export function TaskForm({
  task,
  onSubmit,
  onCancel,
  loading = false,
  showActions = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(task);
  const canSubmit = title.trim().length > 0 && !loading;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ title: title.trim() });
    if (!isEditing) setTitle('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onCancel?.();
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isEditing ? 'Edit task title...' : 'Write a task here...'}
        disabled={loading}
        className="flex-1"
      />
      {showActions && (
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button size="sm" type="button" onClick={handleSubmit} disabled={!canSubmit}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
}

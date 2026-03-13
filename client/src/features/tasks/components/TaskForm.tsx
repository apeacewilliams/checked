import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from './DatePicker';
import type { Task } from '../types';

export interface TaskFormValues {
  title: string;
  dueDate?: string | null;
  tags?: string[];
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
  const [dueDate, setDueDate] = useState<string | null>(task?.dueDate ?? null);
  const [tags, setTags] = useState<string[]>(task?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(task);
  const canSubmit = title.trim().length > 0 && !loading;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ title: title.trim(), dueDate, tags });
    if (!isEditing) {
      setTitle('');
      setDueDate(null);
      setTags([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onCancel?.();
  };

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase();
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setTagInput('');
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && tagInput === '') {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Title row */}
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isEditing ? 'Edit task title...' : 'Write a task here...'}
          disabled={loading}
          className="flex-1"
        />
        {!showActions && (
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button size="sm" type="button" onClick={handleSubmit} disabled={!canSubmit}>
              Add
            </Button>
          </div>
        )}
      </div>

      <DatePicker value={dueDate} onChange={setDueDate} disabled={loading} />

      {/* Tags — edit dialog only */}
      {isEditing && (
        <>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="rounded-full hover:bg-muted p-0.5"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => tagInput.trim() && addTag(tagInput)}
              placeholder="Add tag (press Enter or comma)"
              disabled={loading}
              className="text-sm"
            />
          </div>
        </>
      )}

      {showActions && (
        <div className="flex justify-end gap-2 pt-1">
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

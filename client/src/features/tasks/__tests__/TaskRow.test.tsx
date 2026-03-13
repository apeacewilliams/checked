import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskDesktopRow, TaskMobileCard } from '../components/TaskRow';
import type { Task } from '../types';

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <table>
      <tbody>{children}</tbody>
    </table>
  );
}

const baseTask: Task = {
  id: 'task-1',
  title: 'Buy groceries',
  description: null,
  completed: false,
  city: null,
  weather: null,
  dueDate: null,
  tags: [],
  position: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskDesktopRow', () => {
  it('renders the task title', () => {
    const props = { task: baseTask, onToggle: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() };

    render(
      <TableWrapper>
        <TaskDesktopRow {...props} />
      </TableWrapper>,
    );

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('calls onToggle with the task when the checkbox is clicked', async () => {
    const onToggle = vi.fn();

    const props = { task: baseTask, onToggle, onEdit: vi.fn(), onDelete: vi.fn() };
    render(
      <TableWrapper>
        <TaskDesktopRow {...props} />
      </TableWrapper>,
    );

    await userEvent.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledWith(baseTask);
  });

  it('calls onEdit with the task when the edit button is clicked', async () => {
    const onEdit = vi.fn();

    const props = { task: baseTask, onToggle: vi.fn(), onEdit, onDelete: vi.fn() };

    render(
      <TableWrapper>
        <TaskDesktopRow {...props} />
      </TableWrapper>,
    );

    await userEvent.click(screen.getByRole('button', { name: /edit buy groceries/i }));

    expect(onEdit).toHaveBeenCalledWith(baseTask);
  });

  it('calls onDelete with the task when the delete button is clicked', async () => {
    const onDelete = vi.fn();

    const props = { task: baseTask, onToggle: vi.fn(), onEdit: vi.fn(), onDelete };

    render(
      <TableWrapper>
        <TaskDesktopRow {...props} />
      </TableWrapper>,
    );

    await userEvent.click(screen.getByRole('button', { name: /delete buy groceries/i }));

    expect(onDelete).toHaveBeenCalledWith(baseTask);
  });
});

describe('TaskMobileCard', () => {
  it('renders the task title', () => {
    const props = { task: baseTask, onToggle: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() };

    render(<TaskMobileCard {...props} />);

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('applies line-through class when task is completed', () => {
    const completed = { ...baseTask, completed: true };

    const props = { task: completed, onToggle: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() };

    render(<TaskMobileCard {...props} />);

    const title = screen.getByText('Buy groceries');

    expect(title).toHaveClass('line-through');
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn();

    const props = { task: baseTask, onToggle, onEdit: vi.fn(), onDelete: vi.fn() };

    render(<TaskMobileCard {...props} />);

    await userEvent.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledWith(baseTask);
  });
});

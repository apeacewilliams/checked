import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskForm } from '../components/TaskForm';

vi.mock('./DatePicker', () => ({
  DatePicker: () => <div data-testid="date-picker" />,
}));

const noop = () => {};

describe('TaskForm', () => {
  it('renders the title input', () => {
    render(<TaskForm onSubmit={noop} />);

    expect(screen.getByPlaceholderText('Write a task here...')).toBeInTheDocument();
  });

  it('Add button is disabled when title is empty', () => {
    render(<TaskForm onSubmit={noop} />);

    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('Add button is enabled when title has content', async () => {
    render(<TaskForm onSubmit={noop} />);

    await userEvent.type(screen.getByPlaceholderText('Write a task here...'), 'Buy groceries');

    expect(screen.getByRole('button', { name: /add/i })).not.toBeDisabled();
  });

  it('calls onSubmit with the trimmed title on button click', async () => {
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByPlaceholderText('Write a task here...'), '  Buy milk  ');

    await userEvent.click(screen.getByRole('button', { name: /add/i }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'Buy milk' }));
  });

  it('calls onCancel when Cancel is clicked', async () => {
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={noop} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('submits on Enter key press in title input', async () => {
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText('Write a task here...');

    await userEvent.type(input, 'Task via enter{Enter}');

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'Task via enter' }));
  });

  it('calls onCancel on Escape key press', async () => {
    const onCancel = vi.fn();

    render(<TaskForm onSubmit={noop} onCancel={onCancel} />);

    const input = screen.getByPlaceholderText('Write a task here...');

    await userEvent.type(input, 'hello');

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onCancel).toHaveBeenCalledOnce();
  });
});

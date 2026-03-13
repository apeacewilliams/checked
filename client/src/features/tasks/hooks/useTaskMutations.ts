import { useMutation } from '@apollo/client/react';
import { CREATE_TASK, UPDATE_TASK, DELETE_TASK, GET_TASKS } from '../api';
import { useToast } from '@/features/notifications';
import type {
  CreateTaskData,
  CreateTaskInput,
  UpdateTaskData,
  UpdateTaskInput,
  DeleteTaskData,
  Task,
} from '../types';

export const useTaskMutations = () => {
  const { showSuccess, showError } = useToast();

  const [createTask, { loading: creating }] = useMutation<
    CreateTaskData,
    { input: CreateTaskInput }
  >(CREATE_TASK, {
    refetchQueries: [GET_TASKS],
    onCompleted: () => showSuccess('Task created'),
    onError: (err) => showError(err.message),
  });

  const [updateTask, { loading: updating }] = useMutation<
    UpdateTaskData,
    { id: string; input: UpdateTaskInput }
  >(UPDATE_TASK, {
    onError: (err) => showError(err.message),
  });

  const toggleTask = async (task: Task) => {
    return updateTask({
      variables: { id: task.id, input: { completed: !task.completed } },
      optimisticResponse: {
        updateTask: {
          ...task,
          completed: !task.completed,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  };

  const [deleteTask, { loading: deleting }] = useMutation<DeleteTaskData, { id: string }>(
    DELETE_TASK,
    {
      update(cache, { data }, { variables }) {
        if (!data?.deleteTask || !variables) return;
        cache.evict({ id: cache.identify({ __typename: 'Task', id: variables.id }) });
        cache.gc();
      },
      optimisticResponse: { deleteTask: true },
      onCompleted: () => showSuccess('Task deleted'),
      onError: (err) => showError(err.message),
    },
  );

  return {
    createTask,
    creating,
    updateTask,
    updating,
    toggleTask,
    deleteTask,
    deleting,
  };
};

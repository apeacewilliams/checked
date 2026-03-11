import { useQuery } from '@apollo/client/react';
import { GET_TASKS } from '../api';
import type { GetTasksData, TaskFilters } from '../types';

export const useTasks = (filters?: TaskFilters) => {
  const { data, loading, error, refetch } = useQuery<GetTasksData>(GET_TASKS, {
    variables: { search: filters?.search, tag: filters?.tag },
  });

  const tasks = data?.tasks ?? [];

  return { tasks, loading, error, refetch };
};

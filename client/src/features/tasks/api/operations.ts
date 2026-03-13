import { gql } from '@apollo/client';

// ─── Fragments ───────────────────────────────────────────────

export const WEATHER_FIELDS = gql`
  fragment WeatherFields on Weather {
    tempC
    tempF
    condition
    icon
    humidity
    windKph
  }
`;

export const TASK_FIELDS = gql`
  fragment TaskFields on Task {
    id
    title
    description
    completed
    city
    weather {
      ...WeatherFields
    }
    dueDate
    tags
    position
    createdAt
    updatedAt
  }
  ${WEATHER_FIELDS}
`;

// ─── Queries ─────────────────────────────────────────────────

export const GET_TASKS = gql`
  query GetTasks($search: String, $tag: String) {
    tasks(search: $search, tag: $tag) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

// ─── Mutations ───────────────────────────────────────────────

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      ...TaskFields
    }
  }
  ${TASK_FIELDS}
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;


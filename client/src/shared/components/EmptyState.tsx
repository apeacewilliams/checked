import type { ReactNode } from 'react';

type EmptyStateProps = {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      {icon}
      {title && <h3>{title}</h3>}
      {description && <p>{description}</p>}
      {action}
    </section>
  );
}

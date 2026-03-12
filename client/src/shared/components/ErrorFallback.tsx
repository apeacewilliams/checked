import type { FallbackProps } from 'react-error-boundary';
import { Button } from '@/components/ui/button';

export function ErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold">Something went wrong!</h1>

        <Button className="mt-6" onClick={resetErrorBoundary}>
          Try again
        </Button>
      </div>
    </div>
  );
}

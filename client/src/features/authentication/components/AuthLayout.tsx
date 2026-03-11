import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
  heading: string;
  subheading: string;
}

export function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 tracking-wide">
      <div className="flex flex-col px-6 py-8">
        <span className="text-xl font-bold">Checked</span>

        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardContent>
              <div className="mb-8 flex flex-col">
                <p className="text-2xl text-foreground font-light mb-6">Welcome !</p>
                <h1 className="text-3xl font-bold mb-2">{heading}</h1>
                <p className="text-foreground font-light">{subheading}</p>
              </div>
              {children}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden items-center justify-center lg:flex">
        <img
          src="/images/journal-people-voting-on-a-poll-or-answering-survey.png"
          alt="Checklist illustration"
          className="max-w-sm"
        />
      </div>
    </div>
  );
}

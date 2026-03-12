import { Outlet } from 'react-router';
import { Header } from './Header';

export function AppShell() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-360 px-6 py-8">
        <Outlet />
      </main>
    </>
  );
}

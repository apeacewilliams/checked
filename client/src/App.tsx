import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from './components/ui/sonner';
import { AppShell } from './layout/AppShell';
import { AuthGuard, AuthProvider } from './features/authentication';
import { ErrorFallback } from './shared/components/ErrorFallback';
import { ApolloProvider } from '@apollo/client/react';
import { apolloClient } from './graphql/client';

const DashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('./pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.replace('/')}
        >
          <BrowserRouter>
            <Suspense>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<AuthGuard />}>
                  <Route element={<AppShell />}>
                    <Route index element={<DashboardPage />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
            <Toaster theme="light" />
          </BrowserRouter>
        </ErrorBoundary>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;

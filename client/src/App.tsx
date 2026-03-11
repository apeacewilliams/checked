import { BrowserRouter, Route, Routes } from 'react-router';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from './components/ui/sonner';
import { AppShell } from './layout/AppShell';
import { DashboardPage, LoginPage, RegisterPage } from './pages';
import { AuthGuard, AuthProvider } from './features/authentication';
import { ErrorFallback } from './shared/components/ErrorFallback';

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.replace('/')}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<AuthGuard />}>
              <Route element={<AppShell />}>
                <Route index element={<DashboardPage />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Lazy loading komponentów
const Layout = React.lazy(() => import('./components/layout/Layout'));
const LoginPage = React.lazy(() => import('./components/auth/LoginPage'));
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const DisciplineList = React.lazy(() => import('./components/disciplines/DisciplineList'));
const DisciplineDetails = React.lazy(() => import('./components/disciplines/DisciplineDetails'));
const QuestionList = React.lazy(() => import('./components/questions/QuestionList'));
const QuestionForm = React.lazy(() => import('./components/questions/QuestionForm'));
const QuestionImport = React.lazy(() => import('./components/questions/QuestionImport'));
const TestStart = React.lazy(() => import('./components/tests/TestStart'));
const TestView = React.lazy(() => import('./components/tests/TestView'));
const NotFoundPage = React.lazy(() => import('./components/error/NotFoundPage'));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user?.authenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.EGZAMINATOR_BASE_PATH}>
          <React.Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/disciplines" element={<DisciplineList />} />
                        <Route path="/disciplines/:id" element={<DisciplineDetails />} />
                        <Route path="/questions" element={<QuestionList />} />
                        <Route path="/questions/import" element={<QuestionImport />} />
                        <Route path="/questions/new" element={<QuestionForm />} />
                        <Route path="/questions/:id" element={<QuestionForm />} />
                        <Route path="/tests/new" element={<TestStart />} />
                        <Route path="/tests/:id" element={<TestView />} />
                        <Route path="/tests/*" element={<NotFoundPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </React.Suspense>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

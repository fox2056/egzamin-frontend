import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import QuestionImport from '@/components/questions/QuestionImport';

// Lazy loading komponentów
const Layout = React.lazy(() => import('./components/layout/Layout'));
const Dashboard = React.lazy(() => import('./components/dashboard/Dashboard'));
const DisciplineList = React.lazy(() => import('./components/disciplines/DisciplineList'));
const QuestionList = React.lazy(() => import('./components/questions/QuestionList'));
const QuestionForm = React.lazy(() => import('./components/questions/QuestionForm'));
const TestStart = React.lazy(() => import('./components/tests/TestStart'));
const TestView = React.lazy(() => import('./components/tests/TestView'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <React.Suspense 
          fallback={
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        >
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/disciplines" element={<DisciplineList />} />
              <Route path="/questions" element={<QuestionList />} />
              <Route path="/questions/import" element={<QuestionImport />} />
              <Route path="/questions/new" element={<QuestionForm />} />
              <Route path="/questions/:id" element={<QuestionForm />} />
              <Route path="/tests/new" element={<TestStart />} />
              <Route path="/tests/:id" element={<TestView />} />
            </Routes>
          </Layout>
        </React.Suspense>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

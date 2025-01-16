import React from 'react';
import { loginWithFacebook } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>System Egzaminacyjny</CardTitle>
          <CardDescription>
            Zaloguj się, aby uzyskać dostęp do systemu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={loginWithFacebook}
            className="w-full flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
            </svg>
            Zaloguj się przez Facebook
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage; 
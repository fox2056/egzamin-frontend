import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>404 - Strona nie znaleziona</CardTitle>
          <CardDescription>
            Próbujesz dostać się do strony, która nie istnieje lub nie masz do niej dostępu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            Wróć na stronę główną
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage; 
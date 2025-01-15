import React from 'react';
import { useNavigate } from 'react-router-dom';
import { importQuestions } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const QuestionImport: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
    } else {
      toast({
        title: 'Błąd',
        description: 'Proszę wybrać plik JSON',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: 'Błąd',
        description: 'Proszę wybrać plik do importu',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await importQuestions(file);
      toast({
        title: 'Sukces',
        description: 'Pytania zostały zaimportowane',
      });
      navigate('/questions');
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zaimportować pytań',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Import Pytań</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import z pliku JSON</CardTitle>
          <CardDescription>
            Wybierz plik JSON zawierający pytania do zaimportowania
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Plik JSON</Label>
            <Input
              id="file"
              type="file"
              accept=".json"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleImport}
              disabled={!file || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Importowanie...
                </div>
              ) : (
                'Importuj'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/questions')}
              disabled={isLoading}
            >
              Anuluj
            </Button>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Format pliku JSON:</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
{`[
  {
    "disciplineName": "Nazwa przedmiotu",
    "content": "Treść pytania jednokrotnego wyboru",
    "type": "SINGLE_CHOICE",
    "correctAnswers": ["Poprawna odpowiedź"],
    "incorrectAnswers": [
      "Niepoprawna odpowiedź 1",
      "Niepoprawna odpowiedź 2",
      "Niepoprawna odpowiedź 3"
    ]
  },
  {
    "disciplineName": "Nazwa przedmiotu",
    "content": "Treść pytania wielokrotnego wyboru",
    "type": "MULTIPLE_CHOICE",
    "correctAnswers": [
      "Poprawna odpowiedź 1",
      "Poprawna odpowiedź 2"
    ],
    "incorrectAnswers": [
      "Niepoprawna odpowiedź 1",
      "Niepoprawna odpowiedź 2"
    ]
  }
]`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionImport; 
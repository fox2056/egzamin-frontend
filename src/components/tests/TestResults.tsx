import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TestResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TestResultsProps {
  result: TestResult;
}

const TestResults: React.FC<TestResultsProps> = ({ result }) => {
  const navigate = useNavigate();

  if (!result || !result.questionResults) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Wyniki testu</h1>
          <Button onClick={() => navigate('/')}>Wróć do strony głównej</Button>
        </div>
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-lg font-medium">Brak wyników do wyświetlenia</p>
              <Button onClick={() => navigate('/')} className="mt-4">
                Wróć do strony głównej
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wyniki testu</h1>
        <Button onClick={() => navigate('/')}>Wróć do strony głównej</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Podsumowanie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-medium">Wynik: {result.score}%</p>
              <p className="text-sm text-muted-foreground">
                Poprawne odpowiedzi: {result.correctAnswers} z {result.totalQuestions}
              </p>
            </div>
            <Progress value={result.score} className="w-[200px]" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {result.questionResults.map((question, index) => (
          <Card key={question.questionId} className={question.isCorrect ? 'border-green-500' : 'border-red-500'}>
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {question.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  Pytanie {index + 1}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-medium">{question.content}</p>
              
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Poprawne odpowiedzi:
                </p>
                <ul className="list-disc list-inside">
                  {question.correctAnswers.map((answer) => (
                    <li key={answer} className="text-sm">
                      {answer}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Twoje odpowiedzi:
                </p>
                <ul className="list-disc list-inside">
                  {question.selectedAnswers.map((answer) => (
                    <li
                      key={answer}
                      className={`text-sm ${
                        question.correctAnswers.includes(answer)
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {answer}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestResults; 
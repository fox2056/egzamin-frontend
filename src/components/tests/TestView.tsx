import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTestQuestions, submitTest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TestQuestionsResponse, TestAnswer, TestResult } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import TestResults from './TestResults';

const TestView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string[]>>({});
  const [testResult, setTestResult] = React.useState<TestResult | null>(null);

  const { data: response, isLoading: isQuestionsLoading, error: questionsError } = useQuery<TestQuestionsResponse>({
    queryKey: ['test-questions', id],
    queryFn: () => getTestQuestions(Number(id)),
    enabled: !!id && !testResult,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const questions = response?.questions;

  React.useEffect(() => {
    if (questionsError) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się pobrać pytań testu',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    if (!isQuestionsLoading && questions && questions.length === 0) {
      toast({
        title: 'Błąd',
        description: 'Test nie zawiera pytań',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [questions, isQuestionsLoading, questionsError, toast, navigate]);

  const currentQuestion = questions?.[currentQuestionIndex];
  const progress = questions ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleAnswerSelect = (answer: string) => {
    if (!currentQuestion) return;

    const currentAnswers = selectedAnswers[currentQuestion.id] || [];
    let newAnswers: string[];

    if (currentQuestion.type === 'SINGLE_CHOICE') {
      newAnswers = [answer];
    } else {
      if (currentAnswers.includes(answer)) {
        newAnswers = currentAnswers.filter((a) => a !== answer);
      } else {
        newAnswers = [...currentAnswers, answer];
      }
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: newAnswers,
    }));
  };

  const handleNext = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!questions || !id) return;

    try {
      const answers: TestAnswer[] = questions.map((question) => ({
        questionId: question.id,
        selectedAnswers: selectedAnswers[question.id] || [],
      }));

      const result = await submitTest(Number(id), answers);
      
      if (!result || !result.questionResults) {
        throw new Error('Nieprawidłowe dane wyników testu');
      }
      
      setTestResult(result);
      toast({
        title: 'Sukces',
        description: 'Test został zakończony',
      });
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zakończyć testu',
        variant: 'destructive',
      });
    }
  };

  if (testResult) {
    return <TestResults result={testResult} />;
  }

  if (isQuestionsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Brak pytań</h2>
          <p className="text-muted-foreground">Nie znaleziono pytań dla tego testu</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Wróć do strony głównej
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Test w toku</h1>
        <div className="text-sm text-muted-foreground">
          Pytanie {currentQuestionIndex + 1} z {questions.length}
        </div>
      </div>

      <Progress value={progress} className="w-full" />

      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.content}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.answers.map((answer) => (
            <div key={answer} className="flex items-center space-x-2">
              <Checkbox
                id={answer}
                checked={selectedAnswers[currentQuestion.id]?.includes(answer)}
                onCheckedChange={() => handleAnswerSelect(answer)}
                disabled={currentQuestion.type === 'SINGLE_CHOICE' && selectedAnswers[currentQuestion.id]?.length === 1 && !selectedAnswers[currentQuestion.id]?.includes(answer)}
              />
              <label
                htmlFor={answer}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {answer}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Poprzednie
        </Button>
        {currentQuestionIndex === questions.length - 1 ? (
          <Button onClick={handleSubmit}>Zakończ test</Button>
        ) : (
          <Button onClick={handleNext}>Następne</Button>
        )}
      </div>
    </div>
  );
};

export default TestView; 
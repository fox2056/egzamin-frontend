import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getQuestion, getDisciplines } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Question, QuestionType, Discipline } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

const questionSchema = z.object({
  content: z.string().min(1, 'Treść pytania jest wymagana'),
  type: z.enum(['SINGLE_CHOICE', 'MULTIPLE_CHOICE']),
  disciplineId: z.string().min(1, 'Wybierz dyscyplinę'),
  correctAnswers: z.array(z.string()).min(1, 'Dodaj przynajmniej jedną poprawną odpowiedź'),
  incorrectAnswers: z.array(z.string()).min(1, 'Dodaj przynajmniej jedną niepoprawną odpowiedź'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

const QuestionForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [correctAnswers, setCorrectAnswers] = React.useState<string[]>(['']);
  const [incorrectAnswers, setIncorrectAnswers] = React.useState<string[]>(['']);

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: '',
      type: 'SINGLE_CHOICE',
      disciplineId: '',
      correctAnswers: [''],
      incorrectAnswers: [''],
    },
  });

  const { data: disciplines } = useQuery<Discipline[]>({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });

  const { data: question } = useQuery<Question>({
    queryKey: ['question', id],
    queryFn: () => getQuestion(Number(id)),
    enabled: !!id,
  });

  React.useEffect(() => {
    if (question) {
      form.reset({
        content: question.content,
        type: question.type,
        disciplineId: question.disciplineId.toString(),
        correctAnswers: question.correctAnswers,
        incorrectAnswers: question.incorrectAnswers,
      });
      setCorrectAnswers(question.correctAnswers);
      setIncorrectAnswers(question.incorrectAnswers);
    }
  }, [question, form]);

  const handleAddAnswer = (type: 'correct' | 'incorrect') => {
    if (type === 'correct') {
      setCorrectAnswers([...correctAnswers, '']);
    } else {
      setIncorrectAnswers([...incorrectAnswers, '']);
    }
  };

  const handleRemoveAnswer = (index: number, type: 'correct' | 'incorrect') => {
    if (type === 'correct') {
      const newAnswers = correctAnswers.filter((_, i) => i !== index);
      setCorrectAnswers(newAnswers);
      form.setValue('correctAnswers', newAnswers);
    } else {
      const newAnswers = incorrectAnswers.filter((_, i) => i !== index);
      setIncorrectAnswers(newAnswers);
      form.setValue('incorrectAnswers', newAnswers);
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    try {
      // TODO: Implement API call
      toast({
        title: 'Sukces',
        description: id ? 'Pytanie zostało zaktualizowane' : 'Pytanie zostało dodane',
      });
      navigate('/questions');
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać pytania',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {id ? 'Edytuj pytanie' : 'Dodaj nowe pytanie'}
        </h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treść pytania</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typ pytania</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz typ pytania" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SINGLE_CHOICE">Jednokrotny wybór</SelectItem>
                    <SelectItem value="MULTIPLE_CHOICE">Wielokrotny wybór</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="disciplineId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dyscyplina</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz dyscyplinę" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {disciplines?.map((discipline) => (
                      <SelectItem
                        key={discipline.id}
                        value={discipline.id.toString()}
                      >
                        {discipline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Poprawne odpowiedzi</FormLabel>
            {correctAnswers.map((answer, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={answer}
                  onChange={(e) => {
                    const newAnswers = [...correctAnswers];
                    newAnswers[index] = e.target.value;
                    setCorrectAnswers(newAnswers);
                    form.setValue('correctAnswers', newAnswers);
                  }}
                  placeholder={`Odpowiedź ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRemoveAnswer(index, 'correct')}
                  disabled={correctAnswers.length === 1}
                >
                  Usuń
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddAnswer('correct')}
            >
              Dodaj odpowiedź
            </Button>
          </div>

          <div className="space-y-4">
            <FormLabel>Niepoprawne odpowiedzi</FormLabel>
            {incorrectAnswers.map((answer, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={answer}
                  onChange={(e) => {
                    const newAnswers = [...incorrectAnswers];
                    newAnswers[index] = e.target.value;
                    setIncorrectAnswers(newAnswers);
                    form.setValue('incorrectAnswers', newAnswers);
                  }}
                  placeholder={`Odpowiedź ${index + 1}`}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRemoveAnswer(index, 'incorrect')}
                  disabled={incorrectAnswers.length === 1}
                >
                  Usuń
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddAnswer('incorrect')}
            >
              Dodaj odpowiedź
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/questions')}
            >
              Anuluj
            </Button>
            <Button type="submit">
              {id ? 'Zapisz zmiany' : 'Dodaj pytanie'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default QuestionForm; 
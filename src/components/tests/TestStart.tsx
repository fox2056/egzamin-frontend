import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDisciplines, startTest } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Discipline } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const testSchema = z.object({
  studentName: z.string().min(1, 'Imię i nazwisko jest wymagane'),
  studentEmail: z.string().email('Nieprawidłowy adres email'),
  numberOfQuestions: z.number().min(1, 'Minimalna liczba pytań to 1').max(50, 'Maksymalna liczba pytań to 50'),
  includedDisciplineIds: z.array(z.number()).min(1, 'Wybierz przynajmniej jedną dyscyplinę'),
  excludedDisciplineIds: z.array(z.number()),
});

type TestFormData = z.infer<typeof testSchema>;

const TestStart: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      studentName: '',
      studentEmail: '',
      numberOfQuestions: 10,
      includedDisciplineIds: [],
      excludedDisciplineIds: [],
    },
  });

  const { data: disciplines } = useQuery<Discipline[]>({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });

  // Ustawienie wszystkich dyscyplin jako zaznaczonych po ich pobraniu
  React.useEffect(() => {
    if (disciplines) {
      const disciplineIds = disciplines.map(d => d.id);
      form.setValue('includedDisciplineIds', disciplineIds);
    }
  }, [disciplines, form]);

  const onSubmit = async (data: TestFormData) => {
    if (isSubmitting) return;
    if (data.includedDisciplineIds.length === 0) {
      toast({
        title: 'Błąd',
        description: 'Wybierz przynajmniej jedną dyscyplinę',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const test = await startTest(data);
      navigate(`/tests/${test.id}`);
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się rozpocząć testu',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rozpocznij test</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dane studenta</CardTitle>
              <CardDescription>
                Wprowadź swoje dane, aby rozpocząć test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imię i nazwisko</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ustawienia testu</CardTitle>
              <CardDescription>
                Wybierz dyscypliny i liczbę pytań
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="numberOfQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liczba pytań</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormLabel>Wybierz dyscypliny</FormLabel>
                {disciplines?.map((discipline) => (
                  <div key={discipline.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`discipline-${discipline.id}`}
                      checked={form.watch('includedDisciplineIds').includes(discipline.id)}
                      onCheckedChange={(checked) => {
                        const currentIncluded = form.watch('includedDisciplineIds');
                        if (checked) {
                          form.setValue('includedDisciplineIds', [...currentIncluded, discipline.id]);
                        } else {
                          form.setValue(
                            'includedDisciplineIds',
                            currentIncluded.filter((id) => id !== discipline.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`discipline-${discipline.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {discipline.name} ({discipline.professor})
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Rozpoczynanie...' : 'Rozpocznij test'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TestStart; 
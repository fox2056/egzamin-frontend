import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDiscipline, updateDiscipline, deleteDiscipline } from '@/lib/api';
import { Discipline } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const disciplineSchema = z.object({
  name: z.string().min(1, 'Nazwa przedmiotu jest wymagana'),
  professor: z.string().min(1, 'Imię i nazwisko prowadzącego jest wymagane'),
});

type DisciplineFormData = z.infer<typeof disciplineSchema>;

const DisciplineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { data: discipline, isLoading } = useQuery<Discipline>({
    queryKey: ['discipline', id],
    queryFn: () => getDiscipline(Number(id)),
    enabled: !!id,
  });

  const form = useForm<DisciplineFormData>({
    resolver: zodResolver(disciplineSchema),
    defaultValues: {
      name: '',
      professor: '',
    },
  });

  React.useEffect(() => {
    if (discipline) {
      form.reset({
        name: discipline.name,
        professor: discipline.professor,
      });
    }
  }, [discipline, form]);

  const updateMutation = useMutation({
    mutationFn: (data: DisciplineFormData) => updateDiscipline(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discipline', id] });
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
      toast({
        title: 'Sukces',
        description: 'Przedmiot został zaktualizowany',
      });
      navigate('/disciplines');
    },
    onError: () => {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zaktualizować przedmiotu',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteDiscipline(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
      toast({
        title: 'Sukces',
        description: 'Przedmiot został usunięty',
      });
      navigate('/disciplines');
    },
    onError: () => {
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć przedmiotu',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: DisciplineFormData) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
    setIsDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edycja przedmiotu</CardTitle>
        <CardDescription>
          Zaktualizuj informacje o przedmiocie lub usuń go
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa przedmiotu</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prowadzący</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" type="button">
                    Usuń przedmiot
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Czy na pewno chcesz usunąć ten przedmiot?</DialogTitle>
                    <DialogDescription>
                      Ta akcja jest nieodwracalna.
                    </DialogDescription>
                  </DialogHeader>

                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Uwaga</AlertTitle>
                    <AlertDescription>
                      Wszystkie pytania przypisane do tego przedmiotu również zostaną usunięte.
                    </AlertDescription>
                  </Alert>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Anuluj
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                    >
                      Usuń
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/disciplines')}
                >
                  Anuluj
                </Button>
                <Button type="submit">
                  Zapisz zmiany
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DisciplineDetails; 
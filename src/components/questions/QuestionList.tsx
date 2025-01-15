import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDisciplines, getDisciplineQuestions, deleteQuestion, rateQuestion } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Trash2, ThumbsUp, ThumbsDown, PenSquare, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Question, Discipline } from '@/lib/types';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

/**
 * Komponent wyświetlający listę pytań dla wybranej dyscypliny.
 * Umożliwia:
 * - Wybór dyscypliny z listy rozwijanej
 * - Wyświetlanie pytań z podziałem na poprawne i niepoprawne odpowiedzi
 * - Ocenianie pytań (pozytywnie/negatywnie) wraz z komentarzem
 * - Przeglądanie ocen i komentarzy innych użytkowników
 * - Edycję i usuwanie pytań
 */
const QuestionList: React.FC = () => {
  // Stan komponentu
  const { toast } = useToast();
  const [selectedDiscipline, setSelectedDiscipline] = React.useState<string>('');
  const [isRating, setIsRating] = React.useState(false);
  const [ratingComment, setRatingComment] = React.useState('');
  const [selectedQuestion, setSelectedQuestion] = React.useState<{ id: number; isPositive: boolean } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = React.useState(false);
  const [selectedQuestionComments, setSelectedQuestionComments] = React.useState<Question['ratings'] | null>(null);

  // Pobieranie danych
  /**
   * Pobiera listę wszystkich dyscyplin
   */
  const { data: disciplines } = useQuery<Discipline[]>({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });

  /**
   * Pobiera pytania dla wybranej dyscypliny
   * Aktywne tylko gdy wybrano dyscyplinę
   */
  const { data: questions, isLoading, refetch } = useQuery<Question[]>({
    queryKey: ['questions', selectedDiscipline],
    queryFn: () => getDisciplineQuestions(Number(selectedDiscipline)),
    enabled: !!selectedDiscipline,
  });

  // Funkcje obsługujące akcje użytkownika
  /**
   * Usuwa pytanie o podanym ID
   * @param id - ID pytania do usunięcia
   */
  const handleDelete = async (id: number) => {
    try {
      await deleteQuestion(id);
      toast({
        title: 'Sukces',
        description: 'Pytanie zostało usunięte',
      });
      refetch();
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się usunąć pytania',
        variant: 'destructive',
      });
    }
  };

  /**
   * Otwiera dialog oceny pytania
   * @param questionId - ID pytania do oceny
   * @param isPositive - Czy ocena jest pozytywna
   */
  const handleRateClick = (questionId: number, isPositive: boolean) => {
    setSelectedQuestion({ id: questionId, isPositive });
    setRatingComment('');
    setIsDialogOpen(true);
  };

  /**
   * Zapisuje ocenę pytania wraz z komentarzem
   * Aktywne tylko gdy wybrano pytanie i wprowadzono komentarz
   */
  const handleRate = async () => {
    if (!selectedQuestion || isRating || !ratingComment) return;

    setIsRating(true);
    try {
      await rateQuestion(selectedQuestion.id, selectedQuestion.isPositive, ratingComment);
      toast({
        title: 'Sukces',
        description: 'Ocena została zapisana',
      });
      refetch();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się zapisać oceny',
        variant: 'destructive',
      });
    } finally {
      setIsRating(false);
    }
  };

  /**
   * Otwiera dialog z komentarzami dla pytania
   * @param questionId - ID pytania, którego komentarze chcemy wyświetlić
   */
  const handleShowComments = (question: Question) => {
    if (question.ratings.recentComments.length > 0) {
      setSelectedQuestionComments(question.ratings);
      setIsCommentsDialogOpen(true);
    }
  };

  // Renderowanie komponentu
  return (
    <>
      {/* Nagłówek z tytułem i przyciskiem dodawania */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pytania</h1>
          <Button asChild>
            <Link to="/questions/new">Dodaj pytanie</Link>
          </Button>
        </div>

        {/* Wybór dyscypliny */}
        <div className="w-[250px]">
          <Select value={selectedDiscipline} onValueChange={setSelectedDiscipline}>
            <SelectTrigger>
              <SelectValue placeholder="Wybierz dyscyplinę" />
            </SelectTrigger>
            <SelectContent>
              {disciplines?.map((discipline) => (
                <SelectItem key={discipline.id} value={discipline.id.toString()}>
                  {discipline.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lista pytań lub wskaźnik ładowania */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {questions?.map((question) => (
              <Card key={question.id}>
                {/* Treść pytania i typ */}
                <CardHeader>
                  <CardTitle>{question.content}</CardTitle>
                  <CardDescription>
                    Typ: {question.type === 'SINGLE_CHOICE' ? 'Jednokrotny wybór' : 'Wielokrotny wybór'}
                  </CardDescription>
                </CardHeader>
                {/* Odpowiedzi */}
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium text-green-600 dark:text-green-400">Poprawne odpowiedzi:</p>
                      <ul className="list-disc list-inside">
                        {question.correctAnswers.map((answer, index) => (
                          <li key={index}>{answer}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium text-red-600 dark:text-red-400">Niepoprawne odpowiedzi:</p>
                      <ul className="list-disc list-inside">
                        {question.incorrectAnswers.map((answer, index) => (
                          <li key={index}>{answer}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
                {/* Oceny i akcje */}
                <CardFooter className="flex flex-col gap-4">
                  {/* Statystyki ocen */}
                  <div className="w-full flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{question.ratings.positiveCount}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="h-4 w-4" />
                      <span>{question.ratings.negativeCount}</span>
                    </div>
                    {question.ratings.recentComments.length > 0 && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1 p-0 h-auto hover:bg-transparent"
                        onClick={() => handleShowComments(question)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{question.ratings.recentComments.length}</span>
                      </Button>
                    )}
                  </div>
                  {/* Przyciski akcji */}
                  <div className="w-full flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleRateClick(question.id, true)}
                      disabled={isRating}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleRateClick(question.id, false)}
                      disabled={isRating}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`/questions/${question.id}`}>
                        <PenSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog oceny pytania */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Oceń pytanie</DialogTitle>
            <DialogDescription>
              Dodaj komentarz do swojej oceny
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Twój komentarz..."
            value={ratingComment}
            onChange={(e) => setRatingComment(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleRate} disabled={isRating || !ratingComment}>
              {isRating ? 'Zapisywanie...' : 'Zapisz ocenę'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog z komentarzami */}
      <Dialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Komentarze</DialogTitle>
            <DialogDescription>
              Lista komentarzy dla pytania
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedQuestionComments?.recentComments.map((comment, index) => (
              <div key={index} className="flex items-start gap-2 p-4 rounded-lg border">
                <div className={comment.isPositive ? "text-green-500" : "text-red-500"}>
                  {comment.isPositive ? <ThumbsUp className="h-4 w-4" /> : <ThumbsDown className="h-4 w-4" />}
                </div>
                <p className="text-sm">{comment.comment || 'Brak komentarza'}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommentsDialogOpen(false)}>
              Zamknij
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionList; 
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDisciplines, mergeDisciplines } from '@/lib/api';
import { Button } from '@/components/ui/button';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Discipline } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DisciplineMergeProps {
  onSuccess?: () => void;
}

const DisciplineMerge: React.FC<DisciplineMergeProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [sourceId, setSourceId] = React.useState<string>('');
  const [targetId, setTargetId] = React.useState<string>('');
  const [isMerging, setIsMerging] = React.useState(false);

  const { data: disciplines } = useQuery<Discipline[]>({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });

  const handleMerge = async () => {
    if (!sourceId || !targetId || sourceId === targetId) return;

    setIsMerging(true);
    try {
      await mergeDisciplines(Number(sourceId), Number(targetId));
      toast({
        title: 'Sukces',
        description: 'Dyscypliny zostały połączone',
      });
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Błąd',
        description: 'Nie udało się połączyć dyscyplin',
        variant: 'destructive',
      });
    } finally {
      setIsMerging(false);
    }
  };

  const availableTargetDisciplines = disciplines?.filter(d => d.id !== Number(sourceId)) || [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Połącz przedmioty</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Połącz przedmioty</DialogTitle>
          <DialogDescription>
            Wybierz przedmioty do połączenia. Wszystkie pytania z przedmiotu źródłowego zostaną przeniesione do przedmiotu docelowego.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Przedmiot źródłowy</label>
            <Select value={sourceId} onValueChange={setSourceId}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz przedmiot źródłowy" />
              </SelectTrigger>
              <SelectContent>
                {disciplines?.map((discipline) => (
                  <SelectItem 
                    key={discipline.id} 
                    value={discipline.id.toString()}
                    disabled={discipline.id === Number(targetId)}
                  >
                    {discipline.name} ({discipline.professor})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Przedmiot docelowy</label>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz przedmiot docelowy" />
              </SelectTrigger>
              <SelectContent>
                {availableTargetDisciplines.map((discipline) => (
                  <SelectItem 
                    key={discipline.id} 
                    value={discipline.id.toString()}
                  >
                    {discipline.name} ({discipline.professor})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {sourceId && targetId && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Uwaga</AlertTitle>
              <AlertDescription>
                Ta operacja jest nieodwracalna. Wszystkie pytania z przedmiotu źródłowego zostaną przeniesione do przedmiotu docelowego, a przedmiot źródłowy zostanie usunięty.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Anuluj
          </Button>
          <Button 
            onClick={handleMerge} 
            disabled={!sourceId || !targetId || sourceId === targetId || isMerging}
          >
            {isMerging ? 'Łączenie...' : 'Połącz'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisciplineMerge; 
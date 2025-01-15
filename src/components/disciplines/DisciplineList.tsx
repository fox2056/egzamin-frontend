import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDisciplines } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Discipline } from '@/lib/types';
import { Link } from 'react-router-dom';
import DisciplineMerge from './DisciplineMerge';

const DisciplineList: React.FC = () => {
  const { data: disciplines, refetch } = useQuery<Discipline[]>({
    queryKey: ['disciplines'],
    queryFn: getDisciplines,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Przedmioty</h1>
        <div className="flex gap-2">
          <DisciplineMerge onSuccess={refetch} />
        </div>
      </div>

      <div className="grid gap-4">
        {disciplines?.map((discipline) => (
          <Card key={discipline.id}>
            <CardHeader>
              <CardTitle>{discipline.name}</CardTitle>
              <CardDescription>Prowadzący: {discipline.professor}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link to={`/disciplines/${discipline.id}`}>
                  Edytuj
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DisciplineList; 
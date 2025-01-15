import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStatistics } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Statistics } from '@/lib/types';

const Dashboard: React.FC = () => {
  const { data: statistics, isLoading } = useQuery<Statistics>({
    queryKey: ['statistics'],
    queryFn: getStatistics,
  });

  const chartData = React.useMemo(() => {
    if (!statistics) return [];
    return Object.values(statistics.disciplineStatistics).map((stat) => ({
      name: stat.name,
      pytania: stat.questionCount,
    }));
  }, [statistics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Panel główny</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Łączna liczba pytań</CardTitle>
            <CardDescription>Wszystkie pytania w systemie</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.totalQuestions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ukończone testy</CardTitle>
            <CardDescription>Liczba przeprowadzonych testów</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{statistics.completedTests}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liczba przedmiotów</CardTitle>
            <CardDescription>Aktywne przedmioty w systemie</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Object.keys(statistics.disciplineStatistics).length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rozkład pytań według przedmiotów</CardTitle>
          <CardDescription>Liczba pytań dla każdego przedmiotu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="pytania" 
                  fill="hsl(var(--primary))" 
                  name="Liczba pytań"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.values(statistics.disciplineStatistics).map((stat) => (
          <Card key={stat.disciplineId}>
            <CardHeader>
              <CardTitle>{stat.name}</CardTitle>
              <CardDescription>Prowadzący: {stat.professor}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.questionCount}</p>
              <p className="text-sm text-muted-foreground">pytań</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 
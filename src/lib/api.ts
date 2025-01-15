import { Discipline, Question, QuestionRating, Test, TestAnswer, TestStartRequest, Statistics } from './types';

const API_URL = 'http://localhost:8080/api';

// Funkcje pomocnicze
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Wystąpił błąd');
  }
  return response.json();
};

// Dyscypliny
export const getDisciplines = () => 
  fetch(`${API_URL}/disciplines`).then(handleResponse);

export const getDiscipline = (id: number) => 
  fetch(`${API_URL}/disciplines/${id}`).then(handleResponse);

export const deleteDiscipline = (id: number) => 
  fetch(`${API_URL}/disciplines/${id}`, { method: 'DELETE' }).then(handleResponse);

// Pytania
export const getQuestion = (id: number) => 
  fetch(`${API_URL}/questions/${id}`).then(handleResponse);

export const getDisciplineQuestions = (disciplineId: number) => 
  fetch(`${API_URL}/questions/discipline/${disciplineId}`).then(handleResponse);

export const deleteQuestion = (id: number) => 
  fetch(`${API_URL}/questions/${id}`, { method: 'DELETE' }).then(handleResponse);

export const changeDiscipline = (questionId: number, newDisciplineId: number) => 
  fetch(`${API_URL}/questions/${questionId}/discipline?newDisciplineId=${newDisciplineId}`, {
    method: 'PATCH'
  }).then(handleResponse);

export const importQuestions = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(`${API_URL}/questions/import`, {
    method: 'POST',
    body: formData
  }).then(handleResponse);
};

// Oceny pytań
export const rateQuestion = async (questionId: number, isPositive: boolean, comment: string) => {
  const response = await fetch(`${API_URL}/questions/${questionId}/ratings?isPositive=${isPositive}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment
    })
  });
  return handleResponse(response);
};

export const getQuestionRatings = async (questionId: number) => {
  const response = await fetch(`${API_URL}/questions/${questionId}/ratings/stats`);
  return handleResponse(response);
};

// Testy
export const startTest = (data: TestStartRequest) => 
  fetch(`${API_URL}/tests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse);

export const getStudentTests = (email: string) => 
  fetch(`${API_URL}/tests/student/${email}`).then(handleResponse);

export const getTest = (id: number) => 
  fetch(`${API_URL}/tests/${id}`).then(handleResponse);

export const getTestQuestions = (id: number) => 
  fetch(`${API_URL}/tests/${id}/questions`).then(handleResponse);

export const submitTest = (id: number, answers: TestAnswer[]) => 
  fetch(`${API_URL}/tests/${id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers)
  }).then(handleResponse);

export const updateDiscipline = (id: number, data: { name: string; professor: string }) =>
  fetch(`${API_URL}/disciplines/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(handleResponse);

// Statystyki
export const getStatistics = () => 
  fetch(`${API_URL}/statistics`).then(handleResponse);

export const mergeDisciplines = (sourceId: number, targetId: number) =>
  fetch(`${API_URL}/disciplines/${sourceId}/merge/${targetId}`, {
    method: 'POST',
  }).then(handleResponse); 
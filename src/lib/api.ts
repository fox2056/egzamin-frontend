import { TestAnswer, TestStartRequest } from './types';

const BASE_URL = import.meta.env.EGZAMINATOR_BASE_BACKEND_URL || 'http://localhost:8080';
const API_URL = `${BASE_URL}/api`;

// Funkcje pomocnicze
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      window.location.href = '/login';
      return;
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Wystąpił błąd');
  }
  const data = await response.json();
  
  // Dodaj pole authenticated dla endpointu /auth/user
  if (response.url.endsWith('/auth/user')) {
    return { ...data, authenticated: true };
  }
  
  return data;
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest'
};

const defaultOptions = {
  credentials: 'include' as RequestCredentials,
  headers: defaultHeaders,
  mode: 'cors' as RequestMode,
};

// Dyscypliny
export const getDisciplines = () => 
  fetch(`${API_URL}/disciplines`, defaultOptions).then(handleResponse);

export const getDiscipline = (id: number) => 
  fetch(`${API_URL}/disciplines/${id}`, defaultOptions).then(handleResponse);

export const deleteDiscipline = (id: number) => 
  fetch(`${API_URL}/disciplines/${id}`, { 
    ...defaultOptions, 
    method: 'DELETE' 
  }).then(handleResponse);

// Pytania
export const createQuestion = (data: ApiQuestionData) => 
  fetch(`${API_URL}/questions`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(data)
  }).then(handleResponse);

export const updateQuestion = (id: number, data: ApiQuestionData) =>
  fetch(`${API_URL}/questions/${id}`, {
    ...defaultOptions,
    method: 'PUT',
    body: JSON.stringify(data)
  }).then(handleResponse);

export const getQuestion = (id: number) => 
  fetch(`${API_URL}/questions/${id}`, defaultOptions).then(handleResponse);

export const getDisciplineQuestions = (disciplineId: number) => 
  fetch(`${API_URL}/questions/discipline/${disciplineId}`, defaultOptions).then(handleResponse);

export const deleteQuestion = (id: number) => 
  fetch(`${API_URL}/questions/${id}`, { 
    ...defaultOptions, 
    method: 'DELETE' 
  }).then(handleResponse);

export const changeDiscipline = (questionId: number, newDisciplineId: number) => 
  fetch(`${API_URL}/questions/${questionId}/discipline?newDisciplineId=${newDisciplineId}`, {
    ...defaultOptions,
    method: 'PATCH'
  }).then(handleResponse);

export const importQuestions = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(`${API_URL}/questions/import`, {
    ...defaultOptions,
    method: 'POST',
    headers: {}, // Remove default headers for FormData
    body: formData
  }).then(handleResponse);
};

// Oceny pytań
export const rateQuestion = (questionId: number, isPositive: boolean, comment: string) => 
  fetch(`${API_URL}/questions/${questionId}/ratings?isPositive=${isPositive}`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify({ comment })
  }).then(handleResponse);

export const getQuestionRatings = (questionId: number) => 
  fetch(`${API_URL}/questions/${questionId}/ratings/stats`, defaultOptions).then(handleResponse);

// Testy
export const startTest = (data: TestStartRequest) => 
  fetch(`${API_URL}/tests`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(data)
  }).then(handleResponse);

export const getStudentTests = (email: string) => 
  fetch(`${API_URL}/tests/student/${email}`, defaultOptions).then(handleResponse);

export const getTest = (id: number) => 
  fetch(`${API_URL}/tests/${id}`, defaultOptions).then(handleResponse);

export const getTestQuestions = (id: number) => 
  fetch(`${API_URL}/tests/${id}/questions`, defaultOptions).then(handleResponse);

export const submitTest = (id: number, answers: TestAnswer[]) => 
  fetch(`${API_URL}/tests/${id}/submit`, {
    ...defaultOptions,
    method: 'POST',
    body: JSON.stringify(answers)
  }).then(handleResponse);

export const updateDiscipline = (id: number, data: { name: string; professor: string }) =>
  fetch(`${API_URL}/disciplines/${id}`, {
    ...defaultOptions,
    method: 'PATCH',
    body: JSON.stringify(data)
  }).then(handleResponse);

// Statystyki
export const getStatistics = () => 
  fetch(`${API_URL}/statistics`, defaultOptions).then(handleResponse);

export const mergeDisciplines = (sourceId: number, targetId: number) =>
  fetch(`${API_URL}/disciplines/${sourceId}/merge/${targetId}`, {
    ...defaultOptions,
    method: 'POST',
  }).then(handleResponse);

// Autoryzacja
export const getUser = () => 
  fetch(`${API_URL}/auth/user`, defaultOptions).then(handleResponse);

export const getUserAvatar = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/avatar`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': '*/*',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const blob = new Blob([arrayBuffer], { type: contentType });
    
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return null;
  }
};

export const loginWithFacebook = () => {
  window.location.href = `${BASE_URL}/oauth2/authorization/facebook`;
};

export const logout = () => {
  window.location.href = `${BASE_URL}/api/auth/logout`;
};

interface ApiQuestionData {
  content: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  disciplineId: number;
  correctAnswers: string[];
  incorrectAnswers: string[];
} 
# System Egzaminacyjny - Frontend

Aplikacja frontendowa do zarządzania systemem egzaminacyjnym, umożliwiająca tworzenie i przeprowadzanie testów online.

## 🚀 Funkcjonalności

### Zarządzanie dyscyplinami

- Wyświetlanie listy dyscyplin
- Usuwanie dyscyplin
- Przypisywanie pytań do dyscyplin

### Zarządzanie pytaniami

- Dodawanie nowych pytań
- Edycja istniejących pytań
- Usuwanie pytań
- Import pytań z pliku JSON
- Filtrowanie pytań według dyscyplin
- System oceniania pytań (łapka w górę/dół)

### System testów

- Tworzenie nowych testów
- Losowy wybór pytań z zachowaniem proporcji między dyscyplinami
- Obsługa pytań jednokrotnego i wielokrotnego wyboru
- Automatyczne sprawdzanie odpowiedzi
- Historia testów studenta

## 🛠️ Technologie

- React 18
- TypeScript
- TailwindCSS
- Shadcn/ui
- React Query
- React Hook Form
- Zod
- React Router DOM

## 📦 Instalacja

1. Sklonuj repozytorium:

```bash
git clone https://github.com/twoja-nazwa/egzamin-frontend.git
cd egzamin-frontend
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Uruchom aplikację w trybie deweloperskim:

```bash
npm run dev
```

## 🔧 Konfiguracja

Aplikacja domyślnie łączy się z backendem pod adresem `http://localhost:8080`. Możesz zmienić ten adres w pliku `src/lib/api.ts`.

## 📝 Format danych

### Import pytań (JSON)

```json
[
  {
    "disciplineName": "Algorytmy tekstowe",
    "content": "Który algorytm wyszukiwania danych w tekście porównuje znaki od końca wzorca?",
    "type": "SINGLE_CHOICE",
    "correctAnswers": ["Algorytm Boyer-Moore"],
    "incorrectAnswers": [
      "Naiwne wyszukiwanie",
      "Algorytm KMP",
      "Algorytm Rabin-Karp"
    ]
  }
]
```

### Rozpoczęcie testu

```json
{
  "studentName": "Jan Kowalski",
  "studentEmail": "jan.kowalski@example.com",
  "includedDisciplineIds": [1, 2, 3],
  "excludedDisciplineIds": [4, 5],
  "numberOfQuestions": 10
}
```

## 🌐 Endpointy API

### Pytania

- `POST /api/questions/import` - import pytań z pliku JSON
- `GET /api/questions/{id}` - pobranie pojedynczego pytania
- `GET /api/questions/discipline/{disciplineId}` - pobranie pytań z danej dyscypliny
- `DELETE /api/questions/{id}` - usunięcie pytania
- `PATCH /api/questions/{questionId}/discipline` - zmiana dyscypliny pytania

### Dyscypliny

- `GET /api/disciplines` - lista dyscyplin
- `GET /api/disciplines/{id}` - pobranie dyscypliny
- `DELETE /api/disciplines/{id}` - usunięcie dyscypliny

### Oceny pytań

- `POST /api/questions/{questionId}/ratings` - dodanie oceny
- `GET /api/questions/{questionId}/ratings/stats` - statystyki ocen

### Testy

- `POST /api/tests` - rozpoczęcie testu
- `GET /api/tests/student/{email}` - historia testów studenta
- `GET /api/tests/{id}` - szczegóły testu
- `GET /api/tests/{id}/questions` - pytania testu
- `POST /api/tests/{id}/submit` - zakończenie testu

## 👥 Autorzy

- Twoje imię i nazwisko

## 📄 Licencja

Ten projekt jest licencjonowany na warunkach [MIT License](LICENSE).

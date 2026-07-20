# ZenTask — Modular Task Planner

A premium, feature-rich task management web application built with vanilla HTML, CSS, and JavaScript, powered by Firebase Authentication.

## Features

- **Firebase Auth**: Email/password sign-up & login, Google sign-in
- **Task CRUD**: Create, read, update, and delete tasks
- **Categories**: Personal, Work, Study, Shopping, Health, Other
- **Priority Levels**: High, Medium, Low with color-coded badges
- **Due Dates**: Visual countdown with overdue/warning indicators
- **Filters & Search**: Real-time search, status/priority/category filters
- **Sorting**: Newest, oldest, due date, priority, alphabetical
- **Theme Toggle**: Light/dark mode with system preference detection
- **Per-User Storage**: Tasks scoped to Firebase UID via Local Storage
- **Responsive Design**: Works on desktop and mobile

## Getting Started

1. Serve the project with any static server:
   ```
   python -m http.server 8000
   ```
2. Open `http://localhost:8000/login.html` in your browser.
3. Sign up or log in, then start managing your tasks!

## Project Structure

```
├── index.html          # Main dashboard (auth-protected)
├── login.html          # Login page
├── signup.html         # Registration page
├── css/style.css       # All styles
└── js/
    ├── app.js          # Main app logic & event binding
    ├── auth.js         # Firebase Authentication controller
    ├── firebase.js     # Firebase config & initialization
    ├── storage.js      # Local Storage controller (UID-scoped)
    ├── theme.js        # Theme controller
    ├── ui.js           # UI rendering & DOM manipulation
    └── validation.js   # Form input validation
```

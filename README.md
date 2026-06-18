# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Features
Real-time multiplayer quiz experience, Create and join quiz rooms, Live score tracking and leaderboards, Responsive design for desktop and mobile devices, User-friendly and interactive interface

Important Note

⚠️ Quiz questions cannot be created through the frontend application.

To add or manage quiz questions, you must use the backend API directly through Postman (or another API client). The frontend is designed only for participating in quizzes, viewing results, and interacting with quiz rooms.

Creating Questions
Open Postman.
Use http://localhost:9000/api/quiz/createQuestion backend API endpoint for question creation.
Send the required request payload(question,optionA,optionB,optionC,optionD,answer).
Once created, the questions will be available in the quiz platform

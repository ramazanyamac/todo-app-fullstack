# Todo APP Project

This project consists of a Next.js-based frontend and an Express.js-based backend application. It provides features such as user authentication, multi-language support, and todo list management.

---

## Frontend

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Form Management:** React Hook Form, Yup, Zod
- **UI Components:** Radix UI, Lucide React, Sonner
- **Internationalization:** next-intl
- **Animation:** tw-animate-css
- **State Management & Data Fetching:** SWR
- **Session Management & Auth:** NextAuth.js (JWT-based authentication and session management)
- **Utility Libraries:** dayjs, clsx, class-variance-authority

### Getting Started

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

- **Framework:** Express.js
- **Database:** PostgreSQL (pg, sequelize)
- **Authentication:** bcrypt, jsonwebtoken
- **Environment Variables:** dotenv
- **CORS Support:** cors

### Getting Started

```bash
cd backend
npm install
node src/index.js
```

---

## Folder Structure

```
todo-app/
├── frontend/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── i18n/
│       ├── lib/
│       ├── messages/
│       ├── plugins/
│       └── validations/
├── backend/
│   └── src/
│       ├── constants/
│       ├── controllers/
│       ├── db/
│       ├── middleware/
│       ├── routes/
│       └── services/
```

---

## Features

- User registration and login
- JWT-based authentication
- Add, edit, and delete todos
- Multi-language support (en, tr)
- Modern and accessible UI

---

## Contributing

To contribute, please fork the repository and submit a pull request.

---

## License

ISC

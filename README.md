# App Provedores Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

A modern frontend application built with React and Vite, developed by **Lighthouse Software Systems**.

## 🚀 Tech Stack

This project is built with the following technologies:

- **[React](https://react.dev/)** - A JavaScript library for building user interfaces
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[Tailwind CSS](https://tailwindcss.com/)** - A utility-first CSS framework
- **[React Hook Form](https://react-hook-form.com/)** - Performant, flexible and extensible forms with easy-to-use validation
- **[TanStack Query](https://tanstack.com/query/latest)** - Powerful data synchronization for React

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18.x or higher)
- **npm** (version 9.x or higher) or your preferred package manager

You can verify your installations by running:

```bash
node --version
npm --version
```

## 🔧 Installation

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd app_provedores_front
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

Or using pnpm:

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory (if needed) and configure your environment variables:

```bash
# Example .env file
VITE_API_URL=your_api_url_here
```

### 4. Start the Development Server

```bash
npm run dev
```

Or using your preferred package manager:

```bash
your-package-manager run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

## 📜 Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode. The page will reload when you make changes.

### `npm run build`

Builds the app for production. The build artifacts will be stored in the `dist` folder. This command also runs TypeScript type checking.

### `npm run preview`

Preview the production build locally. This command serves the built application from the `dist` folder.

### `npm run format`

Format code using Prettier. This will format all JavaScript, JSX, TypeScript, and TSX files in the `src` directory.

### `npm run lint`

Run ESLint to check for code quality issues and potential bugs in the codebase.

## 🏗️ Project Structure

```
app_provedores_front/
├── public/          # Static assets
├── src/             # Source code
│   ├── assets/      # Assets
│   ├── components/  # Reusable components
│   ├── contexts/    # Custom contexts
│   ├── hooks/       # Custom hooks
│   ├── layout/      # Layout components
│   ├── modules/     # Feature modules
│   ├── routes/      # Routes
│   ├── services/    # API services and utilities
│   └── theme/       # MUI theme
├── .env             # Environment variables
├── vite.config.js   # Vite configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json     # Project dependencies
```

## 🛠️ Development

### Code Formatting

This project uses Prettier for code formatting. Run the formatter before committing:

```bash
npm run format
```

### Linting

ESLint is configured to maintain code quality. Check for linting errors:

```bash
npm run lint
```

## 📦 Build for Production

To create a production build:

```bash
npm run build
```

The optimized production build will be in the `dist` directory, ready to be deployed.

## 📄 License

This project is private and proprietary to Lighthouse Software Systems.

## 👥 Developed By

**Lighthouse Software Systems**

---

For more information about the technologies used in this project:

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

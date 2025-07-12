
# TaskFlow - AI-Powered Task Management

TaskFlow is a modern, full-featured task management application built with Next.js and supercharged with generative AI capabilities from Google's Gemini models via Genkit. It provides a beautiful and intuitive interface for managing projects, from simple to-do lists to complex Kanban boards.

![TaskFlow Screenshot](https://raw.githubusercontent.com/Apurba-Khanra1999/studio/refs/heads/master/ai-powered-taskflow.png)

## ✨ Key Features

*   **Intuitive Task Management**: A drag-and-drop Kanban board with columns for "To Do", "In Progress", and "Done".
*   **Rich Task Details**: Tasks include titles, descriptions, priorities, due dates, subtasks, and cover images.
*   **AI-Powered Workflows**:
    *   **Smart Create**: Generate a complete task (description, priority, subtasks, image) from just a title.
    *   **Natural Language Processing**: Create tasks using plain English like *"Fix login bug, due tomorrow"*.
    *   **Smart Sort**: Let AI automatically re-prioritize your tasks on the board.
    *   **AI-Generated Content**: Generate task descriptions, subtasks, and images with a single click.
    *   **AI Insights**: Get a motivational summary of your progress on the dashboard.
*   **Multiple Views**: Visualize your work with a Kanban **Board**, a data-rich **Dashboard**, and a **Calendar** view.
*   **Seamless UX**: Features like a command palette (`⌘K`), quick-add popover, notifications, and dark/light modes enhance productivity.
*   **Secure Authentication**: User sign-up and login with email/password or Google, powered by Firebase.
*   **Persistent & Scoped Storage**: Task data and notifications are saved to `localStorage` and are unique to each logged-in user.

## 🚀 Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **AI Integration**: [Genkit (for Google Gemini)](https://firebase.google.com/docs/genkit)
*   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth)
*   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🔧 Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   An active Firebase project
*   A Google AI (Gemini) API Key

### 1. Configuration

First, you need to set up your environment variables. Create a file named `.env` in the root of the project and add your Firebase and Google API keys.

```env
# Google AI API Key (for Genkit on the server-side)
# This key is kept secret and is only used on the server.
GOOGLE_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# Firebase Client-Side Keys (for authentication)
# These are safe to be exposed on the client.
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID"
```

### 2. Install Dependencies

Install the necessary packages using `npm`:

```bash
npm install
```

### 3. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🧠 Core Concepts & Features

### Authentication & Data Storage

*   **Firebase Authentication**: The app supports email/password and Google Sign-In for secure user management.
*   **User-Scoped Data**: All task and notification data is saved in your browser's `localStorage` and is tied to your unique user ID, ensuring your data is completely private and separate from other users.

### The Kanban Board (`/board`)

This is the central hub of the application.
*   **Columns**: Tasks are organized into three status columns: "To Do", "In Progress", and "Done".
*   **Drag & Drop**: Users can move tasks between columns by dragging them.
*   **Filtering & Searching**: A powerful set of filters allows users to find tasks by keyword, priority, or due date.
*   **Compact View**: A toggle to reduce the size of task cards for a more condensed overview.

### AI-Powered Productivity

Genkit is used to integrate Google's Gemini models, providing a suite of AI features:

| Feature           | Description                                                                                             | Triggered By                                     |
| ----------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **Smart Sort**    | Analyzes all non-completed tasks and re-assigns their priority based on urgency and importance.           | "Smart Sort" button on the Board page.           |
| **Smart Create**  | Takes a simple title and generates a full description, priority, subtasks, and a relevant cover image.    | "AI Smart Create" button in the New Task dialog. |
| **Quick Add**     | Parses a natural language string (e.g., "Deploy app next Friday high priority") into a structured task. | Quick Add (`Sparkles` icon) popover in the nav.  |
| **Generate Image**| Creates a unique, professional cover image for a task based on its title.                                 | "Generate with AI" button in the task dialogs.   |
| **Generate Subs.**| Suggests a list of actionable subtasks based on the task's title and description.                       | "Suggest with AI" button in the task dialogs.    |
| **AI Insights**   | Provides a short, motivational summary of the user's current task statistics.                           | AI-Powered Insights card on the Dashboard.       |
| **Audio Summary** | Converts the AI-generated dashboard summary into speech.                                                  | `Volume2` icon on the AI Insights card.          |


### Application Views

Beyond the board, TaskFlow offers several other pages to help users stay organized:

*   **/dashboard**: A high-level overview of productivity. It features:
    *   Statistic cards for total tasks, completion rate, overdue tasks, etc.
    *   Bar and Pie charts visualizing tasks by status and priority.
    *   Lists of upcoming and overdue tasks.
    *   The AI-powered insights summary.

*   **/calendar**: A full-page calendar that displays tasks based on their due dates. Clicking a day shows all tasks due on that date.

*   **/notifications**: An activity feed that shows a chronological history of all actions, such as creating, updating, or completing tasks.

### User Experience Enhancements

*   **Command Palette**: Accessible via `⌘K` or `Ctrl+K`, it allows for quick searching and navigation to any task.
*   **Toasts & Notifications**: Provides instant feedback for actions like creating or deleting tasks.
*   **User-Scoped Data**: All task and notification data is saved in `localStorage` tied to the current user's UID, ensuring data privacy and separation.

## 📂 Project Structure

```
.
├── src
│   ├── ai                 # All Genkit-related code
│   │   └── flows          # Individual AI flows for specific tasks
│   ├── app                # Next.js App Router
│   │   ├── (auth)         # Route group for auth pages (login, signup)
│   │   ├── (main)         # Route group for protected app pages
│   │   └── layout.tsx     # Root layout
│   ├── components         # Reusable React components
│   │   └── ui             # ShadCN UI components
│   ├── hooks              # Custom React hooks (useTasks, useAuth, etc.)
│   ├── lib                # Utility functions and library configs (Firebase)
│   └── public             # Static assets
├── .env                   # Environment variables (MUST BE CREATED MANUALLY)
└── package.json           # Project dependencies and scripts
```

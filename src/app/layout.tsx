import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'TaskFlow Studio - AI Powered',
  description: "TaskFlow is a modern, full-featured task management application built with Next.js and supercharged with generative AI capabilities from Google's Gemini models via Genkit. It provides a beautiful and intuitive interface for managing projects, from simple to-do lists to complex Kanban boards.",
  keywords: 'AI task management, generative AI productivity, Next.js project management, intelligent task organizer, smart to-do list, AI project planner, automated workflow, Kanban AI, Google Gemini, Genkit, Google Gemini Taskflow, Intelligent Project Management, Smart Task Automation, AI Kanban Board, Genkit Integration, Modern To-Do App, AI Workflow Optimization',

  metadataBase: new URL('https://taskflow-studio.vercel.app'),

  openGraph: {
    title: 'TaskFlow Studio - AI Powered',
    description: "TaskFlow is a modern, full-featured task management application built with Next.js and supercharged with generative AI capabilities from Google's Gemini models via Genkit. It provides a beautiful and intuitive interface for managing projects, from simple to-do lists to complex Kanban boards.",
    url: 'https://taskflow-studio.vercel.app/', // Replace with your site URL
    siteName: 'AI powered TaskFlow Studio',
    images: [
      {
        url: 'https://dev.inktagon.com/fileupload/taskflow-banner-2.png', // Ensure this image exists in your /public folder
        width: 1200,
        height: 630,
        alt: 'TaskFlow Studio Preview',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },

  

  authors: [
    { name: 'Apurba Khanra', url: 'https://www.linkedin.com/in/apurbakhanra' },
  ],

  creator: 'Apurba Khanra',

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-body antialiased`} suppressHydrationWarning={true}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
      </body>
    </html>
  );
}

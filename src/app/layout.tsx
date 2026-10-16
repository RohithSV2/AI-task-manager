import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TaskMaster AI - Intelligent Task Management & Workload Prioritization',
  description: 'Smart AI Task Manager with natural language task creation, automated subtask breakdown, Eisenhower Matrix prioritization, and productivity analytics.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-purple-500/30 selection:text-purple-200">
        {children}
      </body>
    </html>
  );
}

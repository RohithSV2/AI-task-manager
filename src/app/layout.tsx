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
    <html lang="en">
      <body className="bg-[#FAF9F6] text-stone-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        {children}
      </body>
    </html>
  );
}

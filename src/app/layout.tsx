import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CloudTask AI - Autonomous Cloud Computing Task Management',
  description: 'Enterprise Cloud-Native AI Task Manager deployed on Vercel Edge with Serverless Microservices and Gemini LLM inference.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}

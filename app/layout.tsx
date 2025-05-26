import Head from 'next/head';
import './globals.css';
import { dmSans, fredoka } from './lib/fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Techfluency</title>
        <meta name="description" content="English made easy" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <html lang="en" className={`${dmSans.variable} ${fredoka.variable}`}>
        <body className="flex thin-scrollbar justify-center h-screen bg-gray-100">
          {children}
        </body>
      </html>
    </>
  );
}


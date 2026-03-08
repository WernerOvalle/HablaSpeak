import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'HablaSpeak – Domina el inglés con IA',
  description:
    'Practica inglés conversacional con un entrevistador de IA. Mejora tu pronunciación, gramática y fluidez en tiempo real.',
  keywords: ['inglés', 'aprender inglés', 'IA', 'práctica de idiomas', 'entrevista trabajo'],
};

// Script inline para evitar flash de tema (FOUC) antes de que React cargue
const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('hablaspeak-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: aplicar tema antes del primer render */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

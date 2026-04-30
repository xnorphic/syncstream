import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const mono = IBM_Plex_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const BASE_URL = 'https://skill-checker-iota.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'skill.checker — Claude Skill Security Analyzer',
    template: '%s | skill.checker',
  },
  description:
    'Analyze Claude Skills (system prompts) for prompt injections, jailbreaks, and security risks using vector similarity and LLM analysis. Free AI security scanner.',
  keywords: [
    'Claude skills security',
    'prompt injection detection',
    'AI jailbreak scanner',
    'system prompt analyzer',
    'LLM security tool',
    'Anthropic Claude',
    'AI red teaming',
    'prompt security',
    'AI safety',
  ],
  authors: [{ name: 'xnorphic', url: 'https://github.com/xnorphic' }],
  creator: 'xnorphic',
  publisher: 'skill.checker',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    url: BASE_URL,
    siteName: 'skill.checker',
    title: 'skill.checker — Claude Skill Security Analyzer',
    description:
      'Detect prompt injections, jailbreaks, and manipulation vectors in Claude system prompts. Powered by Pinecone vector similarity and Claude Sonnet zero-day analysis.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'skill.checker — Claude Skill Security Analyzer',
    description:
      'Detect prompt injections and jailbreaks in Claude system prompts. Free AI security scanning.',
    creator: '@xnorphic',
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: '#201d1d',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'skill.checker',
              url: BASE_URL,
              description:
                'Analyze Claude Skills for prompt injections, jailbreaks, and security risks using vector similarity and LLM analysis.',
              applicationCategory: 'SecurityApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              author: {
                '@type': 'Person',
                name: 'xnorphic',
                url: 'https://github.com/xnorphic',
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

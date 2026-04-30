import type { Metadata } from 'next';
import FeedbackForm from '@/components/FeedbackForm';

export const metadata: Metadata = {
  title: 'Report a Bug — skill.checker',
  description:
    'Found an issue with skill.checker? Report it here and help us improve the AI security analysis tool.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Report a Bug — skill.checker',
    description: 'Help us improve skill.checker by reporting bugs and issues.',
    url: 'https://skill-checker-iota.vercel.app/report-bug',
  },
};

export default function ReportBugPage() {
  return (
    <FeedbackForm
      type="bug"
      commandLabel="report --bug"
      title="Report a Bug"
      subtitle="Found something broken? Describe what happened, what you expected, and how to reproduce it. We review every submission."
      placeholder={`Steps to reproduce:
1. 
2. 

Expected behavior:

Actual behavior:`}
    />
  );
}

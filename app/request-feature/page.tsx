import type { Metadata } from 'next';
import FeedbackForm from '@/components/FeedbackForm';

export const metadata: Metadata = {
  title: 'Request a Feature — skill.checker',
  description:
    'Have an idea to make skill.checker better? Submit a feature request and help shape the future of AI security tooling.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Request a Feature — skill.checker',
    description: 'Shape the future of skill.checker by submitting your feature ideas.',
    url: 'https://skill-checker-iota.vercel.app/request-feature',
  },
};

export default function RequestFeaturePage() {
  return (
    <FeedbackForm
      type="feature"
      commandLabel="request --feature"
      title="Request a Feature"
      subtitle="Have an idea that would make skill.checker more powerful? Describe the problem it solves and how you'd like it to work."
      placeholder={`Feature idea:

Problem it solves:

How it should work:`}
    />
  );
}

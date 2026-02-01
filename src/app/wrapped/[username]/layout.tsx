import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username}'s GitHub Wrapped | GitSkins`,
    description: `See ${username}'s AI-narrated year in code — contributions, languages, streaks, and personality analysis.`,
  };
}

export default function WrappedUserLayout({ children }: { children: React.ReactNode }) {
  return children;
}

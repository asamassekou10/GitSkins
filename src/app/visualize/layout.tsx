import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Repo Architecture Visualizer | GitSkins',
  description: 'AI-generated architecture diagrams and analysis for any GitHub repository.',
  openGraph: {
    title: 'Repo Architecture Visualizer | GitSkins',
    description: 'Visualize any GitHub repository architecture with AI-generated Mermaid diagrams and explanations.',
  },
};

export default function VisualizeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { useEffect, useState } from 'react';
import MarkdownViewer from '../components/markdown/MarkdownViewer';

export const MarkdownPage = () => {
  const [content, setContent] = useState<string>('Ładowanie...');

  useEffect(() => {
    fetch('/examples/markdown/demo.md')
      .then((res) => res.text())
      .then(setContent)
      .catch(() => setContent('Nie udało się załadować pliku markdown.'));
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Markdown & Mermaid Demo</h1>
      <MarkdownViewer content={content} />
    </div>
  );
};

export default MarkdownPage;

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MermaidRenderer from './MermaidRenderer';
import CodeBlock from './CodeBlock';

type CodeProps = {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
};

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

const CodeComponent: React.FC<CodeProps> = ({ node, inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match?.[1];
  
  // Handle Mermaid diagrams
  if (lang === 'mermaid' && !inline) {
    const chart = String(children).replace(/\n$/, '');
    return <MermaidRenderer chart={chart} />;
  }
  
  // Handle regular code blocks with syntax highlighting
  if (!inline && lang) {
    return (
      <CodeBlock 
        language={lang} 
        value={String(children).replace(/\n$/, '')} 
      />
    );
  }
  
  // Inline code
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => (
  <div className={`prose dark:prose-invert max-w-none ${className}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code: CodeComponent,
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownViewer;

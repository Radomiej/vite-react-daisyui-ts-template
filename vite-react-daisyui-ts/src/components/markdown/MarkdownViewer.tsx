import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MermaidRenderer from './MermaidRenderer';
import CodeBlock from './CodeBlock';

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export const MarkdownViewer = ({ content, className = '' }: MarkdownViewerProps) => (
  <div className={`prose max-w-none ${className}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          const lang = match?.[1];
          if (lang === 'mermaid') {
            return <MermaidRenderer chart={String(children).replace(/\n$/, '')} />;
          }
          if (!inline && lang) {
            return <CodeBlock language={lang} value={String(children).replace(/\n$/, '')} />;
          }
          return <code className={className} {...props}>{children}</code>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownViewer;

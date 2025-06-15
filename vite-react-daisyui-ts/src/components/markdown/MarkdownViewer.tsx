import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import MermaidRenderer from './MermaidRenderer';
import CodeBlock from './CodeBlock';
import { twMerge } from 'tailwind-merge';

type CodeProps = {
  node?: unknown;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
};

type MarkdownViewerProps = {
  content: string;
  className?: string;
};

const CodeComponent: React.FC<CodeProps> = ({ 
  inline = false, 
  className = '', 
  children, 
  ...props 
}: CodeProps) => {
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
      <div className="not-prose my-4">
        <CodeBlock 
          language={lang} 
          value={String(children).replace(/\n$/, '')} 
        />
      </div>
    );
  }
  
  // Inline code
  return (
    <code 
      className={twMerge(
        'px-1.5 py-0.5 rounded-md',
        'bg-base-200/70 dark:bg-base-100/10',
        'border border-base-300/50 dark:border-base-100/20',
        'text-sm font-mono text-rose-600 dark:text-rose-400',
        'break-words',
        className
      )} 
      {...props}
    >
      {children}
    </code>
  );
};

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, className = '' }) => {
  const components: Components = useMemo(() => ({
    code: (props) => {
      const { node, className, children, ...rest } = props;
      const isInline = 'inline' in rest ? (rest as any).inline : false;
      return (
        <CodeComponent inline={isInline} className={className} {...rest}>
          {children}
        </CodeComponent>
      );
    },
    h1: (props) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
    h2: (props) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
    h3: (props) => <h3 className="text-2xl font-semibold mt-5 mb-2" {...props} />,
    h4: (props) => <h4 className="text-xl font-semibold mt-4 mb-2" {...props} />,
    p: (props) => <p className="my-4 leading-relaxed" {...props} />,
    a: (props) => (
      <a 
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2" 
        target="_blank" 
        rel="noopener noreferrer"
        {...props} 
      />
    ),
    ul: (props) => <ul className="list-disc pl-8 my-4 space-y-2" {...props} />,
    ol: (props) => <ol className="list-decimal pl-8 my-4 space-y-2" {...props} />,
    blockquote: (props) => (
      <blockquote 
        className="border-l-4 border-gray-300 pl-4 italic text-gray-700 dark:text-gray-300 my-4" 
        {...props} 
      />
    ),
    table: (props) => (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 my-4" {...props} />
      </div>
    ),
    thead: (props) => <thead className="bg-gray-50 dark:bg-gray-800" {...props} />,
    th: (props) => (
      <th 
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
        {...props} 
      />
    ),
    td: (props) => (
      <td 
        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
        {...props} 
      />
    ),
    tr: (props) => (
      <tr className="bg-white dark:bg-gray-800 even:bg-gray-50 dark:even:bg-gray-700" {...props} />
    ),
  }), []);

  return (
    <div className={twMerge('prose dark:prose-invert max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
export default MarkdownViewer;

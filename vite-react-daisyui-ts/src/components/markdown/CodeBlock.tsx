import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface CodeBlockProps {
  language?: string;
  value: string;
}

const COPY_TIMEOUT = 2000;

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  language = 'text', 
  value 
}) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), COPY_TIMEOUT);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };
  return (
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-base-300 dark:border-base-100/10 bg-base-200 dark:bg-base-300">
      <div className="flex items-center justify-between bg-base-300/50 dark:bg-base-100/5 px-4 py-2 border-b border-base-300 dark:border-base-100/10">
        <span className="font-mono text-sm font-medium text-base-content/80 dark:text-base-content/70">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs rounded-md transition-colors hover:bg-base-200/50 dark:hover:bg-base-100/10 text-base-content/60 hover:text-base-content/90"
          title="Copy to clipboard"
          disabled={copied}
        >
          {copied ? (
            <>
              <FiCheck className="w-3.5 h-3.5 text-success" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <FiCopy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto">
        <SyntaxHighlighter 
          language={language}
          style={tomorrow}
          wrapLongLines 
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: 'transparent',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            className: 'font-mono',
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ 
  language = 'text', 
  value 
}) => {
  return (
    <div className="not-prose my-4 overflow-hidden rounded-lg bg-base-200 dark:bg-base-300">
      <div className="flex items-center justify-between bg-base-300 px-4 py-2 text-sm">
        <span className="font-mono text-sm text-base-content/70">
          {language}
        </span>
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

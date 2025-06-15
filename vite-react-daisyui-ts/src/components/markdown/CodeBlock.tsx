import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  language?: string;
  value: string;
}

export const CodeBlock = ({ language, value }: CodeBlockProps) => (
  <SyntaxHighlighter language={language} style={tomorrow} wrapLongLines customStyle={{ borderRadius: '0.5rem', fontSize: '0.95em', margin: 0 }}>
    {value}
  </SyntaxHighlighter>
);

export default CodeBlock;

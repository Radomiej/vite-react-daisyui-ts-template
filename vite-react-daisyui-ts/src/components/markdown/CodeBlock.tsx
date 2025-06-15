import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { FiCopy, FiCheck, FiCode } from 'react-icons/fi';
import { 
  FaJs, FaPython, FaJava, FaHtml5, FaCss3Alt, FaReact, 
  FaNodeJs, FaGithub, FaGitAlt, FaTerminal, FaDatabase
} from 'react-icons/fa';
import { 
  SiTypescript, SiCplusplus, SiPhp, SiRuby, SiSwift, 
  SiKotlin, SiRust, SiGo, SiDocker, SiKubernetes, SiGraphql,
  SiMongodb, SiPostgresql, SiMysql, SiRedis, SiElasticsearch,
  SiSharp
} from 'react-icons/si'; 

const getLanguageIcon = (language: string) => {
  const lang = language.toLowerCase();
  
  const iconMap: Record<string, React.ReactNode> = {
    // Languages
    'javascript': <FaJs className="text-yellow-400" />,
    'typescript': <SiTypescript className="text-blue-600" />,
    'python': <FaPython className="text-blue-400" />,
    'java': <FaJava className="text-red-500" />,
    'c++': <SiCplusplus className="text-blue-700" />,
    'c#': <SiSharp className="text-purple-600" />,
    'php': <SiPhp className="text-indigo-500" />,
    'ruby': <SiRuby className="text-red-600" />,
    'swift': <SiSwift className="text-orange-500" />,
    'kotlin': <SiKotlin className="text-purple-500" />,
    'rust': <SiRust className="text-orange-600" />,
    'go': <SiGo className="text-cyan-500" />,
    'html': <FaHtml5 className="text-orange-500" />,
    'css': <FaCss3Alt className="text-blue-500" />,
    
    // Frameworks
    'react': <FaReact className="text-cyan-400" />,
    'node': <FaNodeJs className="text-green-600" />,
    'docker': <SiDocker className="text-blue-400" />,
    'kubernetes': <SiKubernetes className="text-blue-600" />,
    'graphql': <SiGraphql className="text-pink-600" />,
    
    // Databases
    'sql': <FaDatabase className="text-blue-400" />,
    'mongodb': <SiMongodb className="text-green-500" />,
    'postgresql': <SiPostgresql className="text-blue-700" />,
    'mysql': <SiMysql className="text-blue-600" />,
    'redis': <SiRedis className="text-red-600" />,
    'elasticsearch': <SiElasticsearch className="text-blue-500" />,
    
    // Version Control
    'git': <FaGitAlt className="text-orange-600" />,
    'github': <FaGithub className="text-gray-800 dark:text-gray-200" />,
    
    // Shell
    'bash': <FaTerminal className="text-gray-600" />,
    'shell': <FaTerminal className="text-gray-600" />,
    'sh': <FaTerminal className="text-gray-600" />,
    'zsh': <FaTerminal className="text-gray-600" />,
    'powershell': <FaTerminal className="text-blue-700" />,
  };

  return iconMap[lang] || <FiCode className="text-base-content/70" />;
};

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
    <div className="not-prose my-4 overflow-hidden rounded-lg border border-base-300/80 dark:border-base-100/10 bg-base-200/80 dark:bg-base-300/80 backdrop-blur-sm">
      <div className="flex items-center justify-between bg-base-300/90 dark:bg-base-200/30 px-4 py-2.5 border-b border-base-300/70 dark:border-base-100/20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-5 h-5">
            {getLanguageIcon(language)}
          </div>
          <span className="font-mono text-sm font-semibold text-base-content/90 dark:text-base-content/80">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all"
          style={{
            backgroundColor: copied ? 'oklch(var(--su)/0.9)' : 'oklch(var(--n)/0.1)',
            color: copied ? 'white' : 'oklch(var(--bc)/0.8)',
            border: '1px solid',
            borderColor: copied ? 'oklch(var(--su)/0.3)' : 'oklch(var(--n)/0.15)',
          }}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
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
      <div className="overflow-x-auto bg-base-100/30 dark:bg-base-300/50">
        <div className="min-h-[2.5rem] p-4">
          <SyntaxHighlighter 
            language={language}
            style={tomorrow}
            wrapLongLines 
            customStyle={{
              margin: 0,
              padding: 0,
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
    </div>
  );
};

export default CodeBlock;

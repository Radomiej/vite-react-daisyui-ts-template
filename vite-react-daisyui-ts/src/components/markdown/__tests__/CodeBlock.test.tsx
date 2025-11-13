import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { CodeBlock } from '../CodeBlock';

// Mock react-syntax-highlighter
vi.mock('react-syntax-highlighter', () => ({
  Prism: ({ children, language }: { children: React.ReactNode; language?: string }) => (
    <pre data-testid="syntax-highlighter" data-language={language}>
      <code>{children}</code>
    </pre>
  )
}));

vi.mock('react-syntax-highlighter/dist/cjs/styles/prism', () => ({
  tomorrow: {}
}));

// Mock react-icons
vi.mock('react-icons/fi', () => ({
  FiCopy: () => <span data-testid="copy-icon">Copy</span>,
  FiCheck: () => <span data-testid="check-icon">Check</span>,
  FiCode: () => <span data-testid="code-icon">Code</span>
}));

vi.mock('react-icons/fa', () => ({
  FaJs: () => <span data-testid="js-icon">JS</span>,
  FaPython: () => <span data-testid="python-icon">Python</span>,
  FaJava: () => <span data-testid="java-icon">Java</span>,
  FaHtml5: () => <span data-testid="html-icon">HTML</span>,
  FaCss3Alt: () => <span data-testid="css-icon">CSS</span>,
  FaReact: () => <span data-testid="react-icon">React</span>,
  FaNodeJs: () => <span data-testid="node-icon">Node</span>,
  FaGithub: () => <span data-testid="github-icon">GitHub</span>,
  FaGitAlt: () => <span data-testid="git-icon">Git</span>,
  FaTerminal: () => <span data-testid="terminal-icon">Terminal</span>,
  FaDatabase: () => <span data-testid="database-icon">Database</span>
}));

vi.mock('react-icons/si', () => ({
  SiTypescript: () => <span data-testid="typescript-icon">TypeScript</span>,
  SiCplusplus: () => <span data-testid="cpp-icon">C++</span>,
  SiPhp: () => <span data-testid="php-icon">PHP</span>,
  SiRuby: () => <span data-testid="ruby-icon">Ruby</span>,
  SiSwift: () => <span data-testid="swift-icon">Swift</span>,
  SiKotlin: () => <span data-testid="kotlin-icon">Kotlin</span>,
  SiRust: () => <span data-testid="rust-icon">Rust</span>,
  SiGo: () => <span data-testid="go-icon">Go</span>,
  SiDocker: () => <span data-testid="docker-icon">Docker</span>,
  SiKubernetes: () => <span data-testid="kubernetes-icon">Kubernetes</span>,
  SiGraphql: () => <span data-testid="graphql-icon">GraphQL</span>,
  SiMongodb: () => <span data-testid="mongodb-icon">MongoDB</span>,
  SiPostgresql: () => <span data-testid="postgresql-icon">PostgreSQL</span>,
  SiMysql: () => <span data-testid="mysql-icon">MySQL</span>,
  SiRedis: () => <span data-testid="redis-icon">Redis</span>,
  SiElasticsearch: () => <span data-testid="elasticsearch-icon">Elasticsearch</span>,
  SiSharp: () => <span data-testid="csharp-icon">C#</span>
}));

describe('CodeBlock', () => {
  const mockCode = 'const hello = "world";';

  it('renders with default language', () => {
    render(<CodeBlock value={mockCode} />);
    
    expect(screen.getByText('text')).toBeInTheDocument();
    expect(screen.getByTestId('syntax-highlighter')).toBeInTheDocument();
    expect(screen.getByText(mockCode)).toBeInTheDocument();
    expect(screen.getByTestId('code-icon')).toBeInTheDocument();
  });

  it('renders with specified language', () => {
    render(<CodeBlock language="javascript" value={mockCode} />);
    
    expect(screen.getByText('javascript')).toBeInTheDocument();
    expect(screen.getByTestId('js-icon')).toBeInTheDocument();
    expect(screen.getByTestId('syntax-highlighter')).toHaveAttribute('data-language', 'javascript');
  });

  it('shows correct language icons', () => {
    const languages = [
      { lang: 'typescript', icon: 'typescript-icon' },
      { lang: 'python', icon: 'python-icon' },
      { lang: 'java', icon: 'java-icon' },
      { lang: 'html', icon: 'html-icon' },
      { lang: 'css', icon: 'css-icon' },
      { lang: 'react', icon: 'react-icon' },
      { lang: 'bash', icon: 'terminal-icon' },
      { lang: 'sql', icon: 'database-icon' },
      { lang: 'c++', icon: 'cpp-icon' },
      { lang: 'c#', icon: 'csharp-icon' }
    ];

    languages.forEach(({ lang, icon }) => {
      const { unmount } = render(<CodeBlock language={lang} value={mockCode} />);
      expect(screen.getByTestId(icon)).toBeInTheDocument();
      unmount();
    });
  });

  it('shows default icon for unknown language', () => {
    render(<CodeBlock language="unknown-language" value={mockCode} />);
    expect(screen.getByTestId('code-icon')).toBeInTheDocument();
  });

  it('handles case-insensitive language matching', () => {
    render(<CodeBlock language="JAVASCRIPT" value={mockCode} />);
    expect(screen.getByTestId('js-icon')).toBeInTheDocument();
  });

  it('renders copy button', () => {
    render(<CodeBlock value={mockCode} />);
    expect(screen.getByTitle('Copy to clipboard')).toBeInTheDocument();
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<CodeBlock language="javascript" value={mockCode} />);
    
    const container = screen.getByText('javascript').closest('div')?.parentElement?.parentElement;
    expect(container).toHaveClass('not-prose', 'my-4', 'overflow-hidden', 'rounded-lg');
  });

  it('handles various shell languages', () => {
    const shellLanguages = ['bash', 'shell', 'sh', 'zsh', 'powershell'];
    
    shellLanguages.forEach(lang => {
      const { unmount } = render(<CodeBlock language={lang} value={mockCode} />);
      expect(screen.getByTestId('terminal-icon')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles database languages', () => {
    render(<CodeBlock language="sql" value={mockCode} />);
    expect(screen.getByTestId('database-icon')).toBeInTheDocument();
  });

  it('handles various programming languages', () => {
    const progLanguages = ['go', 'rust', 'swift', 'kotlin', 'php', 'ruby'];
    
    progLanguages.forEach(lang => {
      const { unmount } = render(<CodeBlock language={lang} value={mockCode} />);
      expect(screen.getByText(lang)).toBeInTheDocument();
      unmount();
    });
  });
});

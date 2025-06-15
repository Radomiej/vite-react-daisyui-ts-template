import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
}

export const MermaidRenderer = ({ chart }: MermaidRendererProps) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chart) return;
    let cancelled = false;
    const renderMermaid = async () => {
      try {
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose', fontFamily: 'inherit' });
        const { svg } = await mermaid.render('mermaid-diagram-' + Math.random().toString(36).substring(2, 8), chart);
        if (!cancelled) setSvg(svg);
      } catch (err) {
        if (!cancelled) setError('Błąd renderowania diagramu');
      }
    };
    renderMermaid();
    return () => { cancelled = true; };
  }, [chart]);

  if (error) return <div className="text-error">{error}</div>;
  return <div className="mermaid my-4" ref={ref} dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}>{!svg && 'Rendering diagram...'}</div>;
};

export default MermaidRenderer;

import { useEffect, useRef, useState, useCallback } from 'react';
import mermaid from 'mermaid';

// Initialize Mermaid with default configuration
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'inherit',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
  },
});

interface MermaidRendererProps {
  chart: string;
}

export const MermaidRenderer = ({ chart }: MermaidRendererProps) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const renderMermaid = useCallback(async (chartToRender: string) => {
    try {
      const id = 'mermaid-' + Math.random().toString(36).substring(2, 8);
      
      // Parse and render the chart
      const { svg } = await mermaid.render(id, chartToRender);
      return svg;
    } catch (err) {
      console.error('Error rendering Mermaid diagram:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    
    const processChart = async () => {
      if (!chart) return;
      
      try {
        const result = await renderMermaid(chart);
        if (!cancelled) {
          setSvg(result);
        }
      } catch {
        if (!cancelled) {
          setError('Error rendering diagram');
        }
      }
    };
    
    processChart();
    
    return () => {
      cancelled = true;
    };
  }, [chart, renderMermaid]);

  // Use a ref to set the innerHTML after the component mounts/updates
  useEffect(() => {
    if (ref.current && svg) {
      ref.current.innerHTML = svg;
    }
  }, [svg]);

  if (error) return <div className="text-error p-4 rounded-lg bg-error/10">{error}</div>;
  
  return (
    <div className="mermaid-container my-6 w-full overflow-auto">
      <div className="mermaid my-4 mx-auto" ref={ref}>
        {!svg && 'Rendering diagram...'}
      </div>
    </div>
  );
};

export default MermaidRenderer;

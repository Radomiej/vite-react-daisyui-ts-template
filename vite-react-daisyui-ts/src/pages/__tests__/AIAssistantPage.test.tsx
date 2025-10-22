import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AIAssistantPage from '../AIAssistantPage';

describe('AIAssistantPage', () => {
  it('should render AI Assistant page', () => {
    render(
      <BrowserRouter>
        <AIAssistantPage />
      </BrowserRouter>
    );

    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });

  it('should render provider selector', () => {
    render(
      <BrowserRouter>
        <AIAssistantPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Providers')).toBeInTheDocument();
  });

  it('should render production toggle', () => {
    render(
      <BrowserRouter>
        <AIAssistantPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Production')).toBeInTheDocument();
  });

  it('should render default providers', () => {
    render(
      <BrowserRouter>
        <AIAssistantPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/LiteLLM/)).toBeInTheDocument();
    expect(screen.getByText(/N8n/)).toBeInTheDocument();
  });
});

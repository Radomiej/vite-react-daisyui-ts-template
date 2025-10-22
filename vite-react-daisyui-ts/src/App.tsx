import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { DemoPage } from './pages/DemoPage';
import { PostsPage } from './pages/PostsPage';
import { MarkdownPage } from './pages/MarkdownPage';
import { ChartsPage } from './pages/ChartsPage';
import FlowPage from './pages/FlowPage';
import KanbanPage from './pages/KanbanPage';
import AIAssistantPage from './pages/AIAssistantPage';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="/posts" element={<PostsPage />} />
              <Route path="/markdown" element={<MarkdownPage />} />
              <Route path="/charts" element={<ChartsPage />} />
              <Route path="/flow" element={<FlowPage />} />
              <Route path="/kanban" element={<KanbanPage />} />
              <Route path="/ai-assistant" element={<AIAssistantPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

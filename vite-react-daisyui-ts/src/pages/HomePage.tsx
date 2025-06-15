import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to daisyUI</h1>
        <p className="text-lg text-base-content/70 mb-8 max-w-2xl">
          A clean, customizable, and accessible component library for React and Tailwind CSS
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/demo">
            <Button variant="primary" size="lg">View Demo</Button>
          </Link>
          <Link to="/posts">
            <Button variant="outline" size="lg">View Posts</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

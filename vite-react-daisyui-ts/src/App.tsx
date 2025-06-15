import { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';
import { Search, Info, Mail, User, Lock } from 'lucide-react';
import { Counter } from './features/counter';

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", 
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", 
  "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
  "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"
];

function App() {
  const { theme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="App min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-10">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">daisyUI Demo</a>
        </div>
        <div className="flex-none gap-2 items-center">
          <div className="form-control hidden md:block">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search..." 
                size="sm"
                className="w-48 transition-all duration-200 focus:w-64"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost gap-1">
              <span className="hidden md:inline">Theme</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-64 max-h-[70vh] overflow-y-auto">
              {THEMES.map((t) => (
                <li key={t}>
                  <button 
                    className={`${theme === t ? 'active' : ''}`}
                    onClick={() => setTheme(t)}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <main className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to daisyUI</h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            A clean, customizable, and accessible component library for React and Tailwind CSS
          </p>
        </div>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Featured Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card 
              title="Buttons"
              image="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
              actions={
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Default</Button>
                  <Button size="sm" variant="primary">Primary</Button>
                  <Button size="sm" variant="secondary">Secondary</Button>
                  <Button size="sm" variant="accent">Accent</Button>
                  <Button size="sm" variant="outline">Outline</Button>
                  <Button size="sm" variant="ghost">Ghost</Button>
                </div>
              }
            >
              <p>Beautifully designed buttons for all your UI needs.</p>
            </Card>

            <Card 
              title="Inputs"
              actions={
                <Button onClick={() => setIsModalOpen(true)}>Show Form</Button>
              }
            >
              <div className="space-y-4">
                <Input 
                  label="Email" 
                  placeholder="your@email.com" 
                  leftIcon={<Mail className="h-4 w-4" />} 
                />
                <Input 
                  type="password" 
                  label="Password" 
                  placeholder="••••••••" 
                  leftIcon={<Lock className="h-4 w-4" />} 
                />
              </div>
            </Card>

            <Card 
              title="Info Card"
              variant="bordered"
              actions={
                <div className="flex gap-2">
                  <Button size="sm" variant="primary">Learn More</Button>
                  <Button size="sm" variant="ghost">Dismiss</Button>
                </div>
              }
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Did you know?</h3>
                  <p className="text-sm text-base-content/70">
                    daisyUI is a component library for Tailwind CSS that provides beautiful, accessible UI components.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-base-100 rounded-xl p-8 text-center shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-base-content/70 mb-6 max-w-2xl mx-auto">
            Join thousands of developers who are already building amazing user interfaces with daisyUI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="primary" size="lg">Get Started</Button>
            <Button variant="outline" size="lg">View Documentation</Button>
          </div>
        </section>

        {/* Counter */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center mb-8">
            <Counter />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-base-300 text-base-content">
        <div className="container mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <p className="text-sm text-base-content/70">
                daisyUI is a component library for Tailwind CSS that provides beautiful, accessible UI components.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="link link-hover text-sm">Documentation</a></li>
                <li><a href="#" className="link link-hover text-sm">Components</a></li>
                <li><a href="#" className="link link-hover text-sm">Templates</a></li>
                <li><a href="#" className="link link-hover text-sm">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><a href="#" className="link link-hover text-sm">Discord</a></li>
                <li><a href="#" className="link link-hover text-sm">Twitter</a></li>
                <li><a href="#" className="link link-hover text-sm">GitHub Discussions</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="link link-hover text-sm">Privacy Policy</a></li>
                <li><a href="#" className="link link-hover text-sm">Terms of Service</a></li>
                <li><a href="#" className="link link-hover text-sm">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-base-content/10 mt-8 pt-8 text-center text-sm text-base-content/70">
            <p>© {new Date().getFullYear()} daisyUI Demo. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Sign Up"
        size="md"
        actions={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary">Sign Up</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            leftIcon={<User className="h-4 w-4" />}
            value={formData.name}
            onChange={handleInputChange}
            name="name"
          />
          <Input 
            label="Email" 
            type="email" 
            placeholder="your@email.com" 
            leftIcon={<Mail className="h-4 w-4" />}
            value={formData.email}
            onChange={handleInputChange}
            name="email"
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            leftIcon={<Lock className="h-4 w-4" />}
            value={formData.password}
            onChange={handleInputChange}
            name="password"
          />
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input type="checkbox" className="checkbox checkbox-sm" />
              <span className="label-text">I agree to the terms and conditions</span>
            </label>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;

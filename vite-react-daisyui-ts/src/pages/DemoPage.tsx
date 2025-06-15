import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Info, Mail, Lock } from 'lucide-react';

export const DemoPage = () => {
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
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Demo Page</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Buttons</h2>
        <div className="flex flex-wrap gap-4 mb-8">
          <Button>Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Info Card">
            <p>This is a simple card component with some example content.</p>
          </Card>
          
          <Card title="With Actions" actions={
            <div className="flex gap-2">
              <Button size="sm" variant="primary">Action</Button>
              <Button size="sm" variant="ghost">Cancel</Button>
            </div>
          }>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm">This card has action buttons in the footer.</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Form Elements</h2>
        <div className="max-w-md space-y-4">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
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
          <div className="pt-2">
            <Button variant="primary" className="w-full">Submit</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

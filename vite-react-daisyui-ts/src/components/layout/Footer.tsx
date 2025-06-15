import { Book, Github, MessageCircle, ShieldCheck, ScrollText, FileCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content">
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Book className="w-5 h-5" />About</h3>
            <p className="text-sm text-base-content/70">
              daisyUI is a component library for Tailwind CSS that provides beautiful, accessible UI components.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Github className="w-5 h-5" />Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="link link-hover text-sm flex items-center gap-1"><Book className="w-4 h-4" />Documentation</a></li>
              <li><a href="#" className="link link-hover text-sm flex items-center gap-1"><Github className="w-4 h-4" />GitHub</a></li>
              <li><a href="#" className="link link-hover text-sm flex items-center gap-1"><MessageCircle className="w-4 h-4" />Discord</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ShieldCheck className="w-5 h-5" />Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="link link-hover text-sm flex items-center gap-1"><ScrollText className="w-4 h-4" />Privacy Policy</a></li>
              <li><a href="#" className="link link-hover text-sm flex items-center gap-1"><FileCheck className="w-4 h-4" />Terms of Service</a></li>
              <li><a href="#" className="link link-hover text-sm flex items-center gap-1"><ShieldCheck className="w-4 h-4" />License</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-base-content/10 mt-8 pt-8 text-center text-sm text-base-content/70">
          <p>© {new Date().getFullYear()} daisyUI Demo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

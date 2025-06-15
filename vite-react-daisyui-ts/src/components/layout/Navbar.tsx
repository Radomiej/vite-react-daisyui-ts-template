import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { Home, Sun, Menu, Palette } from 'lucide-react';

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", 
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", 
  "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
  "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"
];

export const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-10" role="navigation" aria-label="Main navigation">
      <div className="flex-1 flex items-center gap-4">
        <Link to="/" className="btn btn-ghost normal-case text-xl px-2 flex items-center gap-2"><Home className="w-5 h-5" />daisyUI Demo</Link>
        <div className="hidden md:flex flex-row gap-2">
          <Link to="/posts" className="btn btn-ghost flex items-center gap-2"><Palette className="w-4 h-4" />Posts</Link>
          <Link to="/demo" className="btn btn-ghost flex items-center gap-2"><Sun className="w-4 h-4" />Demo</Link>
          <Link to="/charts" className="btn btn-ghost flex items-center gap-2">📊 Charts</Link>
        </div>
      </div>
      <div className="flex-none">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost gap-1 flex items-center">
            <Palette className="h-5 w-5" />
            <span className="hidden md:inline">Theme</span>
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
      <div className="dropdown dropdown-end md:hidden">
        <label tabIndex={0} className="btn btn-ghost btn-square">
          <Menu className="h-5 w-5" />
        </label>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/demo">Demo</Link></li>
          <li><Link to="/charts">📊 Charts</Link></li>
        </ul>
      </div>
    </nav>
  );
};

import { Link } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';

const THEMES = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", 
  "retro", "cyberpunk", "valentine", "halloween", "garden", "forest", "aqua", "lofi", 
  "pastel", "fantasy", "wireframe", "black", "luxury", "dracula", "cmyk", "autumn", 
  "business", "acid", "lemonade", "night", "coffee", "winter", "dim", "nord", "sunset"
];

export const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-10">
      <div className="flex-1 flex items-center gap-4">
        <Link to="/" className="btn btn-ghost normal-case text-xl px-2">daisyUI Demo</Link>
        <div className="hidden md:flex flex-row gap-2">
          <Link to="/posts" className="btn btn-ghost">Posts</Link>
          <Link to="/demo" className="btn btn-ghost">Demo</Link>
        </div>
      </div>
      <div className="flex-none">
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
      <div className="dropdown dropdown-end md:hidden">
        <label tabIndex={0} className="btn btn-ghost btn-square">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </label>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><Link to="/posts">Posts</Link></li>
          <li><Link to="/demo">Demo</Link></li>
        </ul>
      </div>
    </div>
  );
};

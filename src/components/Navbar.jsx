import { ShoppingCart, Menu } from "lucide-react";

export default function Navbar({ logoUrl, socialLinks = [], onCartClick }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/70 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-8 w-auto" />
          ) : (
            <span className="text-white font-bold text-xl">GrainKart</span>
          )}
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#products" className="hover:text-white">Products</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={onCartClick} className="relative inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg">
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
          </button>
          <button className="md:hidden text-white/80">
            <Menu />
          </button>
        </div>
      </div>
      {socialLinks?.length > 0 && (
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-2 flex gap-4 overflow-x-auto">
            {socialLinks.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-white/70 hover:text-white text-sm">
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

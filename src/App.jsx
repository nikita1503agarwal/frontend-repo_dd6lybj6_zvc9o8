import { useEffect, useMemo, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import CartDrawer from "./components/CartDrawer";
import AdminPanel from "./components/AdminPanel";

const API = import.meta.env.VITE_BACKEND_URL;

export default function App() {
  const [settings, setSettings] = useState({ logo_url: null, hero_slides: [], social_links: [] });
  const [products, setProducts] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("shop"); // shop | admin

  const load = async () => {
    const s = await fetch(`${API}/api/settings`).then(r => r.json()).catch(()=>({logo_url:null, hero_slides:[], social_links:[]}));
    setSettings(s);
    const p = await fetch(`${API}/api/products`).then(r => r.json()).catch(()=>[]);
    setProducts(p);
  };
  useEffect(() => { load(); }, []);

  const addToCart = (p) => {
    setCart((c) => {
      const i = c.findIndex(x => x.id === p.id);
      if (i >= 0) { const n = [...c]; n[i] = { ...n[i], qty: (n[i].qty || 1) + 1 }; return n; }
      return [...c, { ...p, qty: 1 }];
    });
    setCartOpen(true);
  };

  const checkout = async () => {
    if (cart.length === 0) return;
    const payload = {
      items: cart.map(i => ({ product_id: i.id, quantity: i.qty, price: i.price, unit: i.unit || "kg" })),
      customer: { name: "Guest", phone: "", address: "", email: "" },
      subtotal: cart.reduce((s,i)=>s+i.price*(i.qty||1),0),
      shipping: 0,
      total: cart.reduce((s,i)=>s+i.price*(i.qty||1),0),
      status: "pending",
    };
    const res = await fetch(`${API}/api/orders`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload)});
    if (res.ok) { alert("Order placed!"); setCart([]); setCartOpen(false); }
    else alert("Error placing order");
  };

  const ShopView = (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar logoUrl={settings.logo_url} socialLinks={settings.social_links} onCartClick={() => setCartOpen(true)} />
      <Hero slides={settings.hero_slides?.length? settings.hero_slides : [
        "https://images.unsplash.com/photo-1541781286675-043c6fc2bc02?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517681163774-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
      ]} logoUrl={settings.logo_url} />
      <ProductGrid products={products} onAddToCart={addToCart} />
      <CartDrawer open={cartOpen} items={cart} onClose={()=>setCartOpen(false)} onCheckout={checkout} />
      <div className="text-center py-8 text-white/50">
        <button onClick={()=>setView("admin")} className="underline">Go to Admin</button>
      </div>
    </div>
  );

  const AdminView = (
    <div className="min-h-screen">
      <AdminPanel />
      <div className="text-center py-4 bg-slate-950">
        <button onClick={()=>setView("shop")} className="text-white underline">Back to Shop</button>
      </div>
    </div>
  );

  return view === "shop" ? ShopView : AdminView;
}

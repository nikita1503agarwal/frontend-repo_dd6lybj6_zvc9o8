import { useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function AdminPanel() {
  const [token, setToken] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [settings, setSettings] = useState({ logo_url: "", hero_slides: [], social_links: [] });
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", category: "atta", price: 0, unit: "kg", image_urls: [] });

  const authFetch = async (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    });
  };

  const loadAll = async () => {
    const s = await fetch(`${API}/api/settings`).then(r => r.json());
    setSettings(s);
    const p = await fetch(`${API}/api/products`).then(r => r.json());
    setProducts(p);
  };

  useEffect(() => { loadAll(); }, []);

  const login = async () => {
    const res = await authFetch(`${API}/api/admin/login?token=${encodeURIComponent(token)}`, { method: "POST" });
    if (res.ok) setLoggedIn(true);
    else alert("Login failed");
  };

  const saveSettings = async () => {
    const res = await authFetch(`${API}/api/settings`, { method: "POST", body: JSON.stringify(settings) });
    const data = await res.json();
    setSettings(data);
  };

  const addProduct = async () => {
    const res = await authFetch(`${API}/api/products`, { method: "POST", body: JSON.stringify(form) });
    const data = await res.json();
    setProducts([data, ...products]);
    setForm({ title: "", description: "", category: "atta", price: 0, unit: "kg", image_urls: [] });
  };

  const updateProduct = async (id, fields) => {
    const res = await authFetch(`${API}/api/products/${id}`, { method: "PUT", body: JSON.stringify({ ...fields }) });
    const data = await res.json();
    setProducts(products.map(p => (p.id === id ? data : p)));
  };

  const deleteProduct = async (id) => {
    await authFetch(`${API}/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter(p => p.id !== id));
  };

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API}/api/media/upload`, { method: "POST", body: fd });
    const data = await res.json();
    return data.url; // backend returns /media/{id}
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          {!loggedIn && (
            <div className="flex gap-2">
              <input value={token} onChange={e=>setToken(e.target.value)} placeholder="Admin Token" className="bg-slate-800 border border-white/10 rounded px-3 py-2" />
              <button onClick={login} className="bg-blue-600 px-4 py-2 rounded">Login</button>
            </div>
          )}
        </div>

        {/* Settings */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
          <h2 className="font-semibold mb-3">Site Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Logo URL</label>
              <input value={settings.logo_url || ""} onChange={e=>setSettings({...settings, logo_url: e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Add Hero Slide (Image URL)</label>
              <div className="flex gap-2">
                <input id="slideUrl" className="flex-1 bg-slate-800 border border-white/10 rounded px-3 py-2" placeholder="https://..." />
                <button onClick={()=>{const v=document.getElementById('slideUrl').value; if(v) setSettings({...settings, hero_slides:[...settings.hero_slides, v]});}} className="bg-blue-600 px-3 rounded">Add</button>
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-2 flex-wrap">
            {settings.hero_slides?.map((s,i)=> (
              <div key={i} className="flex items-center gap-2 bg-white/10 rounded px-2 py-1">
                <img src={s} className="w-10 h-10 object-cover rounded" />
                <button onClick={()=>setSettings({...settings, hero_slides: settings.hero_slides.filter((_,x)=>x!==i)})} className="text-red-400">Remove</button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm text-white/70 mb-1">Social Links</label>
            <div className="flex gap-2 mb-2">
              <input id="socialPlatform" placeholder="platform" className="bg-slate-800 border border-white/10 rounded px-3 py-2" />
              <input id="socialUrl" placeholder="https://..." className="flex-1 bg-slate-800 border border-white/10 rounded px-3 py-2" />
              <button onClick={()=>{
                const p=document.getElementById('socialPlatform').value;
                const u=document.getElementById('socialUrl').value;
                if(p && u) setSettings({...settings, social_links:[...settings.social_links, {platform:p, url:u}]});
              }} className="bg-blue-600 px-3 rounded">Add</button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {settings.social_links?.map((s,i)=> (
                <div key={i} className="flex items-center gap-2 bg-white/10 rounded px-2 py-1">
                  <span className="text-white/80 text-sm">{s.platform}</span>
                  <a href={s.url} className="text-blue-300 text-xs" target="_blank">{s.url}</a>
                  <button onClick={()=>setSettings({...settings, social_links: settings.social_links.filter((_,x)=>x!==i)})} className="text-red-400">Remove</button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-right">
            <button onClick={saveSettings} className="bg-green-600 px-4 py-2 rounded">Save Settings</button>
          </div>
        </section>

        {/* Product Manager */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <h2 className="font-semibold mb-3">Products</h2>
          <div className="grid md:grid-cols-6 gap-3 mb-4">
            <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" className="md:col-span-2 bg-slate-800 border border-white/10 rounded px-3 py-2" />
            <input value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="md:col-span-2 bg-slate-800 border border-white/10 rounded px-3 py-2" />
            <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="bg-slate-800 border border-white/10 rounded px-3 py-2">
              <option value="atta">Atta</option>
              <option value="sattu">Sattu</option>
              <option value="besan">Besan</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-2">
              <input type="number" value={form.price} onChange={e=>setForm({...form, price:parseFloat(e.target.value)})} placeholder="Price" className="flex-1 bg-slate-800 border border-white/10 rounded px-3 py-2" />
              <select value={form.unit} onChange={e=>setForm({...form, unit:e.target.value})} className="w-24 bg-slate-800 border border-white/10 rounded px-3 py-2">
                <option value="kg">kg</option>
                <option value="g">g</option>
              </select>
            </div>
            <div className="md:col-span-6 flex gap-2">
              <input id="imgUrl" placeholder="Image URL" className="flex-1 bg-slate-800 border border-white/10 rounded px-3 py-2" />
              <input id="imgFile" type="file" className="hidden" onChange={async (e)=>{
                const file=e.target.files?.[0];
                if(file){ const url = await uploadImage(file); setForm({...form, image_urls:[...form.image_urls, url]}); e.target.value=''; }
              }}/>
              <button onClick={()=>{const v=document.getElementById('imgUrl').value; if(v) setForm({...form, image_urls:[...form.image_urls, v]});}} className="bg-blue-600 px-3 rounded">Add URL</button>
              <button onClick={()=>document.getElementById('imgFile').click()} className="bg-purple-600 px-3 rounded">Upload</button>
            </div>
            <div className="md:col-span-6 flex gap-2 flex-wrap">
              {form.image_urls.map((u,i)=> (
                <div key={i} className="flex items-center gap-2 bg-white/10 rounded px-2 py-1">
                  <img src={u} className="w-10 h-10 object-cover rounded" />
                  <button onClick={()=>setForm({...form, image_urls: form.image_urls.filter((_,x)=>x!==i)})} className="text-red-400">Remove</button>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right mb-6">
            <button onClick={addProduct} className="bg-green-600 px-4 py-2 rounded">Add Product</button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <img src={p.image_urls?.[0]} className="w-full h-40 object-cover" />
                <div className="p-3 space-y-2">
                  <input value={p.title} onChange={e=>updateProduct(p.id, {...p, title:e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1" />
                  <textarea value={p.description||''} onChange={e=>updateProduct(p.id, {...p, description:e.target.value})} className="w-full bg-slate-800 border border-white/10 rounded px-2 py-1" />
                  <div className="flex gap-2">
                    <input type="number" value={p.price} onChange={e=>updateProduct(p.id, {...p, price: parseFloat(e.target.value)})} className="flex-1 bg-slate-800 border border-white/10 rounded px-2 py-1" />
                    <select value={p.unit||'kg'} onChange={e=>updateProduct(p.id, {...p, unit:e.target.value})} className="w-24 bg-slate-800 border border-white/10 rounded px-2 py-1">
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                  <button onClick={()=>deleteProduct(p.id)} className="w-full bg-red-600 rounded py-1">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

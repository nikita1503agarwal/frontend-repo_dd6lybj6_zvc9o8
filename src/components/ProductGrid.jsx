import { motion } from "framer-motion";

export default function ProductGrid({ products = [], onAddToCart }) {
  return (
    <section id="products" className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Our Products</h2>
          <p className="text-white/60">Pure Atta, Sattu and Besan</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, i) => (
          <motion.div
            key={p.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10"
          >
            <div className="aspect-[4/3] bg-black/20">
              <img src={p.image_urls?.[0] || "https://images.unsplash.com/photo-1505575967455-40e256f73376?q=80&w=1200&auto=format&fit=crop"} alt={p.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold text-lg">{p.title}</h3>
              <p className="text-white/60 text-sm line-clamp-2">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-white font-bold">₹{p.price} / {p.unit || "kg"}</div>
                <button onClick={() => onAddToCart?.(p)} className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm">Add</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

import { motion } from "framer-motion";

export default function Hero({ slides = [], logoUrl }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(236,72,153,0.15),transparent_40%)]" />
      <div className="container mx-auto px-4 py-16 relative">
        <div className="flex flex-col items-center gap-6">
          {logoUrl && (
            <img src={logoUrl} alt="Logo" className="h-16 w-auto drop-shadow" />
          )}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white text-center">
            Fresh Flour Essentials: Atta • Sattu • Besan
          </h1>
          <p className="text-white/70 text-center max-w-2xl">
            Order premium quality grains and flours. Pure, fresh, and delivered fast.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.slice(0, 6).map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="aspect-[4/3] rounded-xl overflow-hidden ring-1 ring-white/10 bg-white/5 backdrop-blur"
            >
              <img src={src} alt="Slide" className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

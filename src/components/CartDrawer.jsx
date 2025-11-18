import { useMemo } from "react";

export default function CartDrawer({ open, items = [], onClose, onCheckout }) {
  const total = useMemo(() => items.reduce((s, i) => s + i.price * (i.qty || 1), 0), [items]);
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div className={`absolute top-0 right-0 h-full w-full sm:w-[420px] bg-slate-900 border-l border-white/10 transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-white font-semibold">Your Cart</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">Close</button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-160px)]">
          {items.length === 0 && <p className="text-white/60">Cart is empty</p>}
          {items.map((i, idx) => (
            <div key={idx} className="flex gap-3 items-center">
              <img src={i.image_urls?.[0]} alt={i.title} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="text-white font-medium">{i.title}</div>
                <div className="text-white/60 text-sm">₹{i.price} × {i.qty || 1}</div>
              </div>
              <div className="text-white">₹{(i.price * (i.qty || 1)).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-white mb-3">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
          <button onClick={onCheckout} className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg">Checkout</button>
        </div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-8">
        <div className="bg-neutral-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-12 h-12 text-neutral-400" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-neutral-900">Your cart is empty</h1>
          <p className="text-neutral-500">Looks like you haven't added anything yet.</p>
        </div>
        <Link to="/shop" className="inline-flex bg-neutral-900 text-white px-8 py-4 rounded-full font-bold hover:bg-neutral-800 transition-all">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <h1 className="text-4xl font-serif font-bold text-neutral-900">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white rounded-3xl border border-neutral-100 shadow-sm"
            >
              <div className="w-32 h-32 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-grow space-y-2 text-center sm:text-left">
                <h3 className="text-xl font-bold text-neutral-900">{item.name}</h3>
                <p className="text-neutral-500 font-serif font-bold">${item.price}</p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center border border-neutral-200 rounded-full px-3 py-1.5 space-x-4">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-neutral-400 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-neutral-400 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-2xl font-serif font-bold text-neutral-900">Order Summary</h2>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>{total > 100 ? "Free" : "$10.00"}</span>
              </div>
              <div className="pt-4 border-t border-neutral-100 flex justify-between text-lg font-bold text-neutral-900">
                <span>Total</span>
                <span>${(total + (total > 100 ? 0 : 10)).toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-neutral-900 text-white py-4 rounded-full font-bold hover:bg-neutral-800 transition-all flex items-center justify-center group"
            >
              Checkout Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <p className="text-[10px] text-center text-neutral-400 uppercase tracking-widest">
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

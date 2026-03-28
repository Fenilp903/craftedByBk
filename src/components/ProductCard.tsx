import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: any, key?: string | number }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || product.images?.[0] || "https://picsum.photos/seed/product/400/400"
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link to={`/product/${product.id}`} className="group space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <img 
          src={product.image || product.images?.[0] || "https://picsum.photos/seed/product/400/400"} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white p-2 rounded-full shadow-sm hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>
        <button 
          onClick={handleAddToCart}
          className="absolute bottom-4 left-4 right-4 bg-white text-neutral-900 py-3 rounded-xl font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors">{product.name}</h3>
          <span className="font-serif font-bold text-neutral-900">${product.price}</span>
        </div>
        <p className="text-xs text-neutral-400 uppercase tracking-widest">{product.category}</p>
      </div>
    </Link>
  );
}

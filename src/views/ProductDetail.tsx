import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Heart, Truck, Shield, ArrowLeft, Plus, Minus, Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images?.[0] || "https://picsum.photos/seed/product/400/400"
    });
    toast.success(`${product.name} added to cart`);
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-24 animate-pulse space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-neutral-200 aspect-square rounded-3xl"></div>
        <div className="space-y-8">
          <div className="h-8 bg-neutral-200 rounded w-3/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          <div className="h-24 bg-neutral-200 rounded"></div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-8">
      <h1 className="text-4xl font-serif font-bold text-neutral-900">Product not found</h1>
      <Link to="/shop" className="inline-flex items-center text-neutral-900 font-bold border-b-2 border-neutral-900 pb-1">
        <ArrowLeft className="mr-2 w-5 h-5" />
        Back to Shop
      </Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <Link to="/shop" className="inline-flex items-center text-neutral-500 hover:text-neutral-900 transition-colors">
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-100">
            <img 
              src={product.images?.[0] || "https://picsum.photos/seed/product/800/800"} 
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {(product.images || [1, 2, 3, 4]).map((img: any, i: number) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-neutral-100 cursor-pointer hover:opacity-70 transition-opacity">
                <img 
                  src={typeof img === 'string' ? img : `https://picsum.photos/seed/${i}/200/200`} 
                  alt={`${product.name} ${i}`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-neutral-900 text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">Handcrafted</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold">4.9</span>
                <span className="text-sm text-neutral-400">(24 reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900">{product.name}</h1>
            <p className="text-3xl font-serif font-bold text-neutral-900">${product.price}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-neutral-900">Description</h3>
            <p className="text-neutral-600 leading-relaxed">
              {product.description || "This unique handcrafted piece is made with the finest materials and attention to detail. Perfect for adding character to your home or as a thoughtful gift for someone special."}
            </p>
          </div>

          <div className="space-y-6 pt-4 border-t border-neutral-100">
            <div className="flex items-center space-x-6">
              <div className="flex items-center border border-neutral-200 rounded-full px-4 py-2 space-x-6">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="hover:text-neutral-400 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-4 text-center">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="hover:text-neutral-400 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-neutral-900 text-white py-4 rounded-full font-bold hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button className="p-4 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-neutral-100">
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
              <Truck className="w-5 h-5" />
              <span>Free Shipping over $100</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-neutral-600">
              <Shield className="w-5 h-5" />
              <span>2 Year Warranty</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

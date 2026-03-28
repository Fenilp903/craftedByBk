import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";
import { Filter, Search, SlidersHorizontal } from "lucide-react";

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = category === "All" 
          ? collection(db, "products")
          : query(collection(db, "products"), where("category", "==", category));
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const categories = ["All", "Home Decor", "Accessories", "Custom Gifts", "Art"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-neutral-900">The Collection</h1>
          <p className="text-neutral-500">Discover our range of handcrafted essentials</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-900 w-full sm:w-64"
            />
          </div>
          <div className="flex items-center space-x-2 bg-white border border-neutral-200 rounded-full px-4 py-2">
            <Filter className="w-5 h-5 text-neutral-400" />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent focus:outline-none text-sm font-medium"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="bg-neutral-200 aspect-square rounded-2xl"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 space-y-4">
          <SlidersHorizontal className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-xl font-bold text-neutral-900">No products found</h3>
          <p className="text-neutral-500">Try adjusting your search or category filters.</p>
        </div>
      )}
    </div>
  );
}

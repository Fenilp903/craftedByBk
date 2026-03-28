import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Trash2, Edit2, Package, Search, X } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const productData = {
        ...data,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        images: [data.image || "https://picsum.photos/seed/product/400/400"],
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
        toast.success("Product updated successfully");
      } else {
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date().toISOString()
        });
        toast.success("Product added successfully");
      }
      
      setShowModal(false);
      setEditingProduct(null);
      reset();
      fetchProducts();
    } catch (error) {
      toast.error("Error saving product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setValue("name", product.name);
    setValue("price", product.price);
    setValue("stock", product.stock);
    setValue("category", product.category);
    setValue("description", product.description);
    setValue("image", product.images?.[0]);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-neutral-900">Manage Products</h1>
          <p className="text-neutral-500">Add, edit, or remove items from your shop</p>
        </div>
        <button 
          onClick={() => { setEditingProduct(null); reset(); setShowModal(true); }}
          className="bg-neutral-900 text-white px-6 py-3 rounded-full font-bold hover:bg-neutral-800 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100">
                      <img src={product.images?.[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-neutral-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">{product.category}</td>
                <td className="px-6 py-4 text-sm font-bold text-neutral-900">${product.price}</td>
                <td className="px-6 py-4 text-sm text-neutral-600">{product.stock} units</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => openEdit(product)} className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 space-y-8 relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-neutral-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-neutral-500">Fill in the details for your handcrafted item</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-neutral-700">Product Name</label>
                <input {...register("name", { required: true })} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Price ($)</label>
                <input type="number" step="0.01" {...register("price", { required: true })} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Stock</label>
                <input type="number" {...register("stock", { required: true })} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Category</label>
                <select {...register("category", { required: true })} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900">
                  <option value="Home Decor">Home Decor</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Custom Gifts">Custom Gifts</option>
                  <option value="Art">Art</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Image URL</label>
                <input {...register("image")} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900" placeholder="https://..." />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-neutral-700">Description</label>
                <textarea {...register("description")} rows={4} className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900" />
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="w-full bg-neutral-900 text-white py-4 rounded-full font-bold hover:bg-neutral-800 transition-all">
                  {editingProduct ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

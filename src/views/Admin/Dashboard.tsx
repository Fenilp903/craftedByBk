import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus, 
  ArrowRight, 
  Database,
  CheckCircle2,
  Clock,
  Truck
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/");
      toast.error("Access denied. Admin only.");
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/stats", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats({
            products: data.products,
            orders: data.orders,
            revenue: data.revenue
          });
          setRecentOrders(data.recentOrders);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
      setLoading(false);
    };

    if (isAdmin) fetchStats();
  }, [isAdmin]);

  const seedData = async () => {
    const products = [
      { name: "Handcrafted Oak Desk Organizer", price: 45, category: "Home Decor", description: "A beautiful desk organizer made from solid oak wood.", stock: 15, image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600" },
      { name: "Custom Engraved Leather Wallet", price: 65, category: "Accessories", description: "Premium leather wallet with custom engraving options.", stock: 20, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=600" },
      { name: "Ceramic Minimalist Vase", price: 35, category: "Home Decor", description: "Elegant minimalist vase for any modern home.", stock: 10, image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=600" },
      { name: "Hand-Woven Cotton Throw", price: 85, category: "Home Decor", description: "Soft, hand-woven cotton throw for cozy evenings.", stock: 5, image: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&q=80&w=600" }
    ];

    try {
      const token = localStorage.getItem("token");
      for (const p of products) {
        await fetch("/api/products", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(p)
        });
      }
      toast.success("Sample products added successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Error seeding data");
    }
  };

  if (authLoading || !isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-neutral-900">Admin Dashboard</h1>
          <p className="text-neutral-500">Welcome back, {user?.name}</p>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={seedData}
            className="bg-neutral-100 text-neutral-900 px-6 py-3 rounded-full font-bold hover:bg-neutral-200 transition-all flex items-center space-x-2"
          >
            <Database className="w-5 h-5" />
            <span>Seed Sample Data</span>
          </button>
          <Link 
            to="/admin/products"
            className="bg-neutral-900 text-white px-6 py-3 rounded-full font-bold hover:bg-neutral-800 transition-all flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: "Total Revenue", value: `$${stats.revenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Products", value: stats.products, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Customers", value: "124", icon: Users, color: "text-orange-600", bg: "bg-orange-50" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
            <div className={`${stat.bg} w-12 h-12 rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold text-neutral-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold text-neutral-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm font-bold text-neutral-900 hover:opacity-70 flex items-center">
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            {recentOrders.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-neutral-50 border-b border-neutral-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Customer</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-neutral-600">{order.address?.fullName || "Guest"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-neutral-900">${order.total?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto" />
                <p className="text-neutral-500">No orders yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Status */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-neutral-900">Store Status</h2>
          <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-bold text-neutral-900">Store Online</span>
              </div>
              <span className="text-xs text-green-600 font-bold uppercase">Active</span>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">Pending Tasks</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium">3 Orders to Ship</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-300" />
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">1 Return Request</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

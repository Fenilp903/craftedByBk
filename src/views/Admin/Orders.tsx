import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { ShoppingBag, Search, Filter, Eye, CheckCircle2, Truck, Clock } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
      toast.success(`Order status updated to ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status === filter.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif font-bold text-neutral-900">Manage Orders</h1>
          <p className="text-neutral-500">Track and fulfill customer orders</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white border border-neutral-200 rounded-full px-4 py-2">
          <Filter className="w-5 h-5 text-neutral-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent focus:outline-none text-sm font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 border-b border-neutral-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Order Info</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Items</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-neutral-900">#{order.id.slice(0, 8)}</p>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-neutral-900">{order.address?.fullName}</p>
                    <p className="text-xs text-neutral-500">{order.address?.city}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {order.items?.length} items
                </td>
                <td className="px-6 py-4 text-sm font-bold text-neutral-900">
                  ${order.total?.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full focus:outline-none ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-neutral-400 hover:text-neutral-900 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="p-24 text-center space-y-4">
            <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto" />
            <h3 className="text-xl font-bold text-neutral-900">No orders found</h3>
            <p className="text-neutral-500">Orders will appear here once customers start purchasing.</p>
          </div>
        )}
      </div>
    </div>
  );
}

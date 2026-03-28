import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isAdmin, login, logout } = useAuth();
  const { items } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-neutral-900">
              Crafted by BK
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-neutral-600 hover:text-neutral-900 transition-colors">Shop</Link>
            <Link to="/about" className="text-neutral-600 hover:text-neutral-900 transition-colors">About</Link>
            <Link to="/contact" className="text-neutral-600 hover:text-neutral-900 transition-colors">Contact</Link>
            
            <div className="flex items-center space-x-4 ml-4 border-l pl-4 border-neutral-200">
              <Link to="/cart" className="relative p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  {isAdmin && (
                    <Link to="/admin" className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                      <LayoutDashboard className="w-6 h-6" />
                    </Link>
                  )}
                  <button onClick={logout} className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                    <LogOut className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                  <User className="w-6 h-6" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-neutral-600">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-neutral-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-neutral-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 py-4 px-4 space-y-4">
          <Link to="/shop" className="block text-neutral-600 py-2" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/about" className="block text-neutral-600 py-2" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className="block text-neutral-600 py-2" onClick={() => setIsOpen(false)}>Contact</Link>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" className="block text-neutral-600 py-2" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>}
              <button onClick={() => { logout(); setIsOpen(false); }} className="block text-neutral-600 py-2 text-left">Logout</button>
            </>
          ) : (
            <Link to="/login" className="block text-neutral-600 py-2" onClick={() => setIsOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

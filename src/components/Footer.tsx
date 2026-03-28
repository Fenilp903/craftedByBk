import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-white text-xl font-serif font-bold">Crafted by BK</h3>
            <p className="text-sm leading-relaxed">
              Handcrafting unique, high-quality products that tell a story. Every piece is made with passion and precision.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/shop?category=custom" className="hover:text-white transition-colors">Custom Orders</Link></li>
              <li><Link to="/shop?category=new" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/#about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Crafted by BK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

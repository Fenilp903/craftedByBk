import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck, Heart } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0 opacity-60">
          <img 
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2070" 
            alt="Handcrafted background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              Artistry in Every <span className="italic text-neutral-300 underline decoration-neutral-500 underline-offset-8">Detail</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 font-light leading-relaxed">
              Discover unique, handcrafted pieces that bring character and soul to your space. Each item is meticulously crafted by BK with passion and precision.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/shop" 
                className="bg-white text-neutral-900 px-8 py-4 rounded-full font-bold hover:bg-neutral-200 transition-all flex items-center group"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/#about" 
                className="bg-transparent border border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-serif font-bold text-neutral-900">Featured Categories</h2>
            <p className="text-neutral-500">Explore our most popular handcrafted collections</p>
          </div>
          <Link to="/shop" className="text-neutral-900 font-bold border-b-2 border-neutral-900 pb-1 hover:opacity-70 transition-opacity">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Home Decor", img: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600", count: "12 Items" },
            { name: "Accessories", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600", count: "8 Items" },
            { name: "Custom Gifts", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600", count: "Custom" }
          ].map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group relative h-96 overflow-hidden rounded-2xl cursor-pointer"
            >
              <img 
                src={cat.img} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs uppercase tracking-widest text-neutral-300 mb-2">{cat.count}</span>
                <h3 className="text-2xl font-serif font-bold">{cat.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-neutral-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Heart, title: "Handcrafted", desc: "Every piece is made by hand with love and care." },
              { icon: Star, title: "Premium Quality", desc: "We use only the finest materials for our creations." },
              { icon: Truck, title: "Fast Shipping", desc: "Carefully packaged and delivered to your door." },
              { icon: Shield, title: "Secure Payment", desc: "Your transactions are safe and encrypted." }
            ].map((feature, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <feature.icon className="w-8 h-8 text-neutral-900" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">{feature.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-serif font-bold text-neutral-900">What Our Customers Say</h2>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Sarah J.", text: "The custom engraving on the wooden box was perfect. A truly unique gift!", role: "Verified Buyer" },
            { name: "Michael R.", text: "Exceptional quality and attention to detail. I'm in love with my new desk organizer.", role: "Verified Buyer" },
            { name: "Emily L.", text: "Fast shipping and beautiful packaging. You can tell it's made with passion.", role: "Verified Buyer" }
          ].map((t, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 space-y-4">
              <p className="text-neutral-600 italic leading-relaxed">"{t.text}"</p>
              <div>
                <h4 className="font-bold text-neutral-900">{t.name}</h4>
                <p className="text-xs text-neutral-400 uppercase tracking-widest">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

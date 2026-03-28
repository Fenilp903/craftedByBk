import { motion } from "motion/react";
import { Heart, Star, Shield, Users } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2070" 
            alt="Workshop" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold"
          >
            Our Story
          </motion.h1>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto font-light">
            Crafting beauty from raw materials, one piece at a time.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl font-serif font-bold text-neutral-900 leading-tight">
            Handcrafted with Passion <br />by <span className="italic text-neutral-400">BK</span>
          </h2>
          <div className="space-y-4 text-neutral-600 leading-relaxed">
            <p>
              "Crafted by BK" began as a small passion project in a home workshop. What started as a hobby of creating unique gifts for friends and family soon grew into a dedicated pursuit of artisanal excellence.
            </p>
            <p>
              Our philosophy is simple: we believe that the objects we surround ourselves with should have a soul. In a world of mass production, we choose the slow path—the path of the artisan. Every piece we create is a testament to the beauty of natural materials and the precision of human touch.
            </p>
            <p>
              From solid oak desk organizers to custom-engraved leather goods, each item is designed to be both functional and beautiful, meant to last for generations.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-2">
              <h3 className="text-3xl font-serif font-bold text-neutral-900">100%</h3>
              <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Handmade</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-serif font-bold text-neutral-900">500+</h3>
              <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Happy Customers</p>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=800" 
              alt="Artisan at work" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl border border-neutral-100 hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="bg-neutral-900 p-3 rounded-2xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-neutral-900">Made with Love</p>
                <p className="text-xs text-neutral-500">In every stitch and cut</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-neutral-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-serif font-bold text-neutral-900">Our Core Values</h2>
            <p className="text-neutral-500">What drives us to create every single day</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Star, title: "Quality First", desc: "We never compromise on materials or craftsmanship. If it's not perfect, it doesn't leave the shop." },
              { icon: Shield, title: "Sustainability", desc: "We source our materials responsibly, favoring natural and long-lasting options that respect the environment." },
              { icon: Users, title: "Community", desc: "We believe in the power of local craftsmanship and supporting the artisan community." }
            ].map((v, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm space-y-6 text-center">
                <div className="bg-neutral-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  <v.icon className="w-8 h-8 text-neutral-900" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">{v.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

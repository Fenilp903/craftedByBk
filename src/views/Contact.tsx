import { motion } from "motion/react";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Contact() {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    console.log("Contact form data:", data);
    toast.success("Message sent! We'll get back to you soon.");
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-5xl font-serif font-bold text-neutral-900">Get in Touch</h1>
        <p className="text-neutral-500 text-lg">
          Have a question about a product or interested in a custom order? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact Info */}
        <div className="space-y-12">
          <div className="space-y-8">
            <h2 className="text-3xl font-serif font-bold text-neutral-900">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-neutral-100 p-4 rounded-2xl">
                  <Mail className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Email Us</p>
                  <p className="text-lg font-bold text-neutral-900">hello@craftedbybk.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-neutral-100 p-4 rounded-2xl">
                  <Phone className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Call Us</p>
                  <p className="text-lg font-bold text-neutral-900">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-neutral-100 p-4 rounded-2xl">
                  <MapPin className="w-6 h-6 text-neutral-900" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold">Visit Us</p>
                  <p className="text-lg font-bold text-neutral-900">123 Artisan Lane, Craftville, CA</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-neutral-900">Follow Our Journey</h3>
            <div className="flex space-x-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="bg-neutral-900 text-white p-4 rounded-2xl hover:bg-neutral-800 transition-all hover:-translate-y-1">
                  <Icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">First Name</label>
                <input 
                  {...register("firstName", { required: true })}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                  placeholder="Jane"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Last Name</label>
                <input 
                  {...register("lastName", { required: true })}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">Email Address</label>
              <input 
                {...register("email", { required: true })}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">Subject</label>
              <select 
                {...register("subject")}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Custom Order">Custom Order</option>
                <option value="Order Status">Order Status</option>
                <option value="Collaboration">Collaboration</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-neutral-700">Message</label>
              <textarea 
                {...register("message", { required: true })}
                rows={5}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all"
                placeholder="Tell us what's on your mind..."
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-neutral-900 text-white py-4 rounded-full font-bold hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Send Message</span>
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

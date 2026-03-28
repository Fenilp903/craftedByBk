import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import { ShieldCheck, CreditCard, Truck, Lock } from "lucide-react";
import { toast } from "sonner";

const stripePromise = loadStripe("pk_test_placeholder"); // Replace with real key

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    if (!user) {
      toast.error("Please login to complete your order");
      login();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          successUrl: `${window.location.origin}/admin?order_success=true`,
          cancelUrl: `${window.location.origin}/cart`,
        }),
      });

      const session = await response.json();
      const stripe = await stripePromise;
      
      if (stripe && session.id) {
        // @ts-ignore
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
        if (error) toast.error(error.message);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <h1 className="text-4xl font-serif font-bold text-neutral-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 text-neutral-900 mb-4">
                <Truck className="w-6 h-6" />
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Full Name</label>
                  <input 
                    {...register("fullName", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Email Address</label>
                  <input 
                    {...register("email", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="john@example.com"
                    defaultValue={user?.email || ""}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Shipping Address</label>
                  <input 
                    {...register("address", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="123 Artisan Lane"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">City</label>
                  <input 
                    {...register("city", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="Craftville"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700">Postal Code</label>
                  <input 
                    {...register("zip", { required: true })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
              <div className="flex items-center space-x-3 text-neutral-900 mb-4">
                <CreditCard className="w-6 h-6" />
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>
              <div className="p-6 border-2 border-neutral-900 rounded-2xl bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-neutral-900 p-2 rounded-lg">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">Stripe Secure Payment</p>
                    <p className="text-xs text-neutral-500">Pay securely with your credit card</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="w-8 h-5 bg-neutral-200 rounded"></div>
                  <div className="w-8 h-5 bg-neutral-200 rounded"></div>
                  <div className="w-8 h-5 bg-neutral-200 rounded"></div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-6 rounded-full font-bold text-lg hover:bg-neutral-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
            >
              {loading ? "Processing..." : (
                <>
                  <ShieldCheck className="w-6 h-6" />
                  <span>Complete Order - ${(total + (total > 100 ? 0 : 10)).toFixed(2)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-6 sticky top-24">
            <h2 className="text-2xl font-serif font-bold text-neutral-900">Your Order</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="text-neutral-400">{item.quantity}x</span>
                    <span className="font-bold text-neutral-900">{item.name}</span>
                  </div>
                  <span className="text-neutral-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-neutral-100 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Shipping</span>
                <span>{total > 100 ? "Free" : "$10.00"}</span>
              </div>
              <div className="pt-4 flex justify-between text-lg font-bold text-neutral-900">
                <span>Total</span>
                <span>${(total + (total > 100 ? 0 : 10)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

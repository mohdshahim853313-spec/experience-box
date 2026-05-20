import React from "react";
import { Layout } from "../components/layout/Layout";
import { Heart, Coffee, Zap } from "lucide-react";
import { cn } from "../lib/utils";

export function DonatePage() {
  const DONATION_TIERS = [
    { title: "Buy us a coffee", amount: "$5", icon: Coffee, desc: "Support the ongoing server costs." },
    { title: "Keep the lights on", amount: "$15", icon: Zap, desc: "Help us maintain and improve the platform." },
    { title: "Super supporter", amount: "$50", icon: Heart, desc: "Fund new features and community growth.", highlight: true },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-rose-100 p-4 rounded-full mb-4">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Support ExperienceBox</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            ExperienceBox is built for the community, by the community. Your donations help us keep the platform free, ad-free, and running smoothly.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {DONATION_TIERS.map((tier, idx) => (
            <div 
              key={idx} 
              className={cn(
                "glass-card p-6 rounded-3xl flex flex-col items-center text-center transition-all hover:-translate-y-1 hover:shadow-lg",
                tier.highlight ? "border-2 border-rose-400 bg-rose-50/30" : "border border-slate-200"
              )}
            >
              <div className={cn("p-3 rounded-full mb-4", tier.highlight ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-600")}>
                <tier.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">{tier.title}</h3>
              <p className="text-3xl font-black text-slate-900 mb-3">{tier.amount}</p>
              <p className="text-sm text-slate-500 mb-6 flex-1">{tier.desc}</p>
              
              <button 
                onClick={() => alert(`Thank you for wanting to donate ${tier.amount}! We are setting up our payment gateways.`)}
                className={cn(
                  "w-full py-2.5 rounded-xl font-bold transition-all",
                  tier.highlight 
                    ? "bg-rose-500 text-white hover:bg-rose-600" 
                    : "bg-slate-900 text-white hover:bg-slate-800"
                )}
              >
                Donate {tier.amount}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 glass-card p-6 rounded-2xl bg-slate-50 text-center mx-auto max-w-2xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-2">Other ways to help</h3>
          <p className="text-slate-600 text-sm">
            If you can't donate right now, that's completely fine! You can support us by sharing ExperienceBox with your friends, writing great stories, and actively participating in spaces.
          </p>
        </div>
      </div>
    </Layout>
  );
}

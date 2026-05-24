import React from "react";
import { Layout } from "../components/layout/Layout";
import { Heart, Copy, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

export function DonatePage() {
  const [copied, setCopied] = React.useState(false);
  const upiId = "mohdshahim853313@okicici";

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-rose-100 p-4 rounded-full mb-4">
            <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Support ExperienceBox</h1>
          <p className="text-slate-600 max-w-xl mx-auto">
            ExperienceBox is built for the community, by the community. Your donations help us keep the platform running smoothly. Scan the QR code below to contribute any amount of your choice.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 sm:p-10 rounded-[2.5rem] flex flex-col items-center text-center border shadow-2xl relative overflow-hidden bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/60">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-500" />
            
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-8 tracking-tight">Buy me a coffee ☕</h3>
            
            <div className="bg-white p-4 rounded-[2rem] shadow-lg border border-slate-100 dark:border-slate-800 mb-8 w-64 h-64 flex items-center justify-center relative">
              <div className="absolute -inset-2 bg-gradient-to-tr from-emerald-400/40 to-teal-400/40 rounded-[2.5rem] opacity-100 transition-duration-500 blur-2xl -z-10" />
              <img 
                src="/qr.png" 
                alt="Google Pay QR Code" 
                className="w-full h-full object-contain rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/shapes/svg?seed=fallback`;
                }}
              />
            </div>
            
            <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-6" />
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-widest">Or Pay via UPI ID</p>
            
            <div 
              onClick={handleCopy}
              className="group flex flex-col sm:flex-row items-center justify-between w-full gap-4 bg-emerald-500 hover:bg-emerald-600 cursor-pointer px-6 py-4 rounded-2xl transition-all active:scale-[0.98] shadow-[0_8px_16px_-6px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_20px_-8px_rgba(16,185,129,0.6)] text-white relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="flex flex-col items-center sm:items-start gap-1 z-10">
                <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">Click to Copy</span>
                <span className="font-mono text-base sm:text-lg font-bold select-all tracking-tight">{upiId}</span>
              </div>
              
              <div className="z-10">
                {copied ? (
                  <div className="bg-white/20 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                ) : (
                  <div className="bg-black/10 group-hover:bg-black/20 p-2.5 w-10 h-10 flex items-center justify-center rounded-xl transition-colors">
                    <Copy className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>
            {copied && <p className="text-emerald-500 font-bold text-sm mt-4 animate-in fade-in slide-in-from-bottom-2">UPI ID copied to clipboard!</p>}
          </div>
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

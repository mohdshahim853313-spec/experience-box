import React from "react";
import { Layout } from "../components/layout/Layout";
import { Mail, Send } from "lucide-react";

export function ContactPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Mail className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
        </div>
        
        <div className="glass-card p-6 md:p-8 rounded-3xl">
          <p className="text-slate-600 mb-6 font-medium">
            Have a question, feedback, or just want to say hi? Drop us a message below and our team will get back to you shortly.
          </p>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Your Name</label>
                <input type="text" className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email Address</label>
                <input type="email" className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="john@example.com" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Subject</label>
              <input type="text" className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" placeholder="How can we help you?" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Message</label>
              <textarea rows={5} className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none" placeholder="Write your message here..." required></textarea>
            </div>
            
            <button type="submit" className="flex items-center gap-2 justify-center w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-md transition-all active:scale-[0.98]">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

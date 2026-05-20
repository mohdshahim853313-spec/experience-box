import React from "react";
import { Layout } from "../components/layout/Layout";
import { Bug, Send } from "lucide-react";

export function ReportBugPage() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-red-100 p-3 rounded-full">
            <Bug className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Report a Bug</h1>
        </div>
        
        <div className="glass-card p-6 md:p-8 rounded-3xl">
          <p className="text-slate-600 mb-6 font-medium">
            Found something not working correctly? Let us know! We appreciate your help in making ExperienceBox better for everyone.
          </p>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Bug report submitted. Thank you!'); }}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Issue Title</label>
              <input type="text" className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all" placeholder="E.g., App crashes when I try to upload a photo" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">What happened?</label>
              <textarea rows={4} className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all resize-none" placeholder="Please describe the issue in detail. What were you trying to do?" required></textarea>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Steps to reproduce</label>
              <textarea rows={3} className="w-full px-4 py-2 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all resize-none" placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..." required></textarea>
            </div>
            
            <button type="submit" className="flex items-center gap-2 justify-center w-full px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 hover:shadow-md transition-all active:scale-[0.98]">
              <Send className="w-4 h-4" />
              Submit Bug Report
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

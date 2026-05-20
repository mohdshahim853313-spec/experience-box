import React from "react";
import { Layout } from "../components/layout/Layout";
import { Info } from "lucide-react";

export function AboutPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Info className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">About Us</h1>
        </div>
        
        <div className="glass-card p-8 rounded-3xl space-y-6 text-slate-700 leading-relaxed">
          <p className="text-xl font-medium text-slate-800">
            Welcome to ExperienceBox, the place where real stories meet real people.
          </p>
          
          <p>
            ExperienceBox was founded on a simple premise: everyone has a story worth telling. Whether it's a profound life lesson, an embarrassing mistake, or a ground reality check, sharing our experiences helps us grow and connect in a deeply human way.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">Our Mission</h2>
          <p>
            To create a safe, engaging, and authentic space where individuals from all walks of life can share their lived experiences without filter, and where readers can find genuine wisdom, comfort, and entertainment.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">What We Believe In</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2">Authenticity</h3>
              <p className="text-sm">We value raw, unedited thoughts over polished perfection. Real life is messy, and so are the best stories.</p>
            </div>
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <h3 className="font-bold text-indigo-900 mb-2">Community</h3>
              <p className="text-sm">We believe in the power of shared experiences to bring people together, transcending borders and backgrounds.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

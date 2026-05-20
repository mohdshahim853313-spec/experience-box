import React from "react";
import { Layout } from "../components/layout/Layout";
import { FileText } from "lucide-react";

export function TermsPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-100 p-3 rounded-full">
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Terms & Conditions</h1>
        </div>
        
        <div className="glass-card p-8 rounded-3xl space-y-6 text-slate-700 leading-relaxed">
          <p>
            Please read these terms and conditions carefully before using Our Service.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">2. User Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">3. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <p className="mt-8 text-sm text-slate-500">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </Layout>
  );
}

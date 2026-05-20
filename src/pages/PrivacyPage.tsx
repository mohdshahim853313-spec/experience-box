import React from "react";
import { Layout } from "../components/layout/Layout";
import { Shield } from "lucide-react";

export function PrivacyPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Shield className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        </div>
        
        <div className="glass-card p-8 rounded-3xl space-y-6 text-slate-700 leading-relaxed">
          <p>
            At ExperienceBox, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our application.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">1. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The information we may collect includes personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">2. How We Use Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create and manage your account.</li>
            <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions.</li>
            <li>Email you regarding your account or order.</li>
            <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Application.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">3. Disclosure of Your Information</h2>
          <p>
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows: By Law or to Protect Rights, Third-Party Service Providers, Marketing Communications.
          </p>
          
          <p className="mt-8 text-sm text-slate-500">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </Layout>
  );
}

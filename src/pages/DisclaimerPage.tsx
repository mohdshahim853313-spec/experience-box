import React from "react";
import { Layout } from "../components/layout/Layout";
import { AlertCircle } from "lucide-react";

export function DisclaimerPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-amber-100 p-3 rounded-full">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Disclaimer</h1>
        </div>
        
        <div className="glass-card p-8 rounded-3xl space-y-6 text-slate-700 leading-relaxed">
          <p>
            The information contained on the ExperienceBox website and application is for general information purposes only.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">External Links Disclaimer</h2>
          <p>
            The Service may contain links to external websites that are not provided or maintained by or in any way affiliated with ExperienceBox. Please note that ExperienceBox does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
          </p>
          
          <h2 className="text-xl font-bold text-slate-900 mt-6 md:mt-8">Content Liability</h2>
          <p>
            ExperienceBox allows users to post stories. We are not responsible for the opinions, facts, or claims made by individual users in their posts. Users are solely responsible for their content. We reserve the right to remove any content that violates our policies or local laws.
          </p>

          <p className="mt-8 text-amber-700 font-medium bg-amber-50 p-4 rounded-xl border border-amber-200">
            By using this application, you agree that you evaluate and bear all risks associated with the use of any content, including any reliance on the accuracy, completeness, or usefulness of such content.
          </p>
        </div>
      </div>
    </Layout>
  );
}

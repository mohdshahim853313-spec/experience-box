import React, { useState, useEffect } from "react";
import { Layout } from "../components/layout/Layout";
import { Users, Compass, Plus, ChevronRight, Hash } from "lucide-react";
import { cn } from "../lib/utils";
import { fetchDiscoverSpaces, fetchYourSpaces } from "../services/db";

export function SpacesPage() {
  const [YOUR_SPACES, setYourSpaces] = useState<any[]>([]);
  const [DISCOVER_SPACES, setDiscoverSpaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [yourData, discoverData] = await Promise.all([
          fetchYourSpaces(),
          fetchDiscoverSpaces()
        ]);
        setYourSpaces(yourData);
        setDiscoverSpaces(discoverData);
      } catch (e) {
        console.error("Failed to load spaces", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full px-4 md:px-0">
        {/* Main Content */}
        <div className="flex-1 w-full min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-2.5 rounded-full">
              <Compass className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Discover Spaces</h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">Find communities that match your interests</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-slate-500">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full" />
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DISCOVER_SPACES.map(space => (
              <div key={space.id} className="glass-card p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-md flex flex-col h-full bg-white/50 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                    {space.icon}
                  </div>
                  <button className="text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 px-4 py-1.5 rounded-full transition-colors focus:ring-2 focus:ring-indigo-200 outline-none">
                    Follow
                  </button>
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{space.name}</h3>
                <p className="text-slate-500 text-sm font-medium mb-5 flex-1 line-clamp-2 leading-relaxed">
                  {space.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mt-auto bg-slate-50 w-fit px-2.5 py-1 rounded-md border border-slate-100">
                  <Users className="w-3.5 h-3.5" />
                  <span>{space.members}</span>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <button className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm active:scale-95">
            <Plus className="w-5 h-5" />
            Create a Space
          </button>

          <div className="glass-card rounded-2xl border border-slate-200 bg-white/50 overflow-hidden shadow-sm">
            <div className="rounded-t-2xl p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-500" />
                Your Spaces
              </h3>
            </div>
            
            <div className="divide-y divide-slate-100/80">
              {YOUR_SPACES.map(space => (
                <a key={space.id} href="#" className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-xl shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                      {space.icon}
                    </div>
                    <div className="min-w-0 pr-2">
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {space.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 truncate">
                        <span className="truncate">{space.role}</span>
                        <span className="w-1 h-1 flex-shrink-0 rounded-full bg-slate-300"></span>
                        <span className="flex-shrink-0">{space.members}</span>
                      </p>
                    </div>
                  </div>
                  {space.unread && (
                    <span className="flex-shrink-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
                      {space.unread}
                    </span>
                  )}
                </a>
              ))}
            </div>
            
            <a href="#" className="flex items-center justify-center gap-1 w-full p-3.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-slate-100 bg-white">
              View all <ChevronRight className="w-4 h-4 opacity-70" />
            </a>
          </div>

          <div className="glass-card rounded-2xl border border-slate-200 p-5 bg-gradient-to-br from-indigo-50 to-purple-50">
            <h3 className="font-bold text-slate-800 mb-2">Why join a space?</h3>
            <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">
              Spaces are micro-communities where people with shared interests can write, discuss, and learn together.
            </p>
            <ul className="space-y-3">
              {[
                "Curated content matching your vibe",
                "Connect with like-minded individuals",
                "Gain exclusive badges and roles"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm font-medium text-slate-700">
                  <div className="mt-0.5 w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600">
                    ✓
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

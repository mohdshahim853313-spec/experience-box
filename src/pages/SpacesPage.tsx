import React from "react";
import { Layout } from "../components/layout/Layout";
import { Users, Compass, Plus, ChevronRight, Hash } from "lucide-react";
import { cn } from "../lib/utils";

export function SpacesPage() {
  const YOUR_SPACES = [
    { id: 1, name: "Startup Chronicles", members: "12.4k", icon: "🚀", unread: 3, role: "Admin" },
    { id: 2, name: "Design Systems", members: "8.2k", icon: "🎨", role: "Contributor" },
    { id: 3, name: "Digital Nomads", members: "45k", icon: "🌍", role: "Member" },
  ];

  const DISCOVER_SPACES = [
    { id: 4, name: "Product Management", members: "89k", icon: "📈", description: "Discussions on product strategy, roadmap, and execution." },
    { id: 5, name: "Indie Hackers", members: "120k", icon: "💻", description: "Bootstrap your way to financial freedom and build in public." },
    { id: 6, name: "Philosophy & Life", members: "34k", icon: "🧠", description: "Deep conversations about the meaning of it all." },
    { id: 7, name: "Personal Finance", members: "250k", icon: "💰", description: "Strategies for wealth building, investments, and financial independence." },
    { id: 8, name: "Web3 Builders", members: "15k", icon: "⛓️", description: "Building the decentralized future, one block at a time." },
    { id: 9, name: "Fitness Journey", members: "67k", icon: "🏋️", description: "Share your progress, routines, and diet tips with the community." },
    { id: 10, name: "Creative Writing", members: "42k", icon: "✍️", description: "A safe space to share your stories, poems, and fiction." },
    { id: 11, name: "Machine Learning", members: "105k", icon: "🤖", description: "Latest trends, papers, and practical applications of AI/ML." },
  ];

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
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <button className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm active:scale-95">
            <Plus className="w-5 h-5" />
            Create a Space
          </button>

          <div className="glass-card rounded-2xl border border-slate-200 bg-white/50 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Banknote, Calendar, CheckCircle, MapPin, AlertCircle, Scale } from "lucide-react";

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inquiries")
      .then(res => res.json())
      .then(data => {
        setInquiries(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500 animate-pulse">Načítám systém...</div>;

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Scale className="text-amber-500" /> Moje poptávky
          </h1>
          <Link href="/" className="flex items-center text-amber-500 font-medium hover:text-amber-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Nové hledání
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
              <AlertCircle className="w-8 h-8" />
            </div>
            <p className="text-slate-400 mb-6">Historie poptávek je prázdná.</p>
            <Link href="/" className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-500 transition-colors">
              Najít právníka
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {inquiries.map((inquiry: any) => (
              <div key={inquiry.id} className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
                {/* Hlavička */}
                <div className="bg-slate-950 p-6 border-b border-slate-800">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {inquiry.message ? inquiry.message.substring(0, 50) + "..." : "Právní případ"}
                      </h2>
                      <div className="text-slate-500 text-sm mt-2 flex gap-4">
                        <span>{new Date(inquiry.created_at).toLocaleDateString()}</span>
                        <span className="text-slate-700">|</span>
                        <span>{inquiry.email}</span>
                      </div>
                    </div>
                    <span className="bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-500/20">
                      {(inquiry.lawyers?.length || 0)} Nabídek
                    </span>
                  </div>
                </div>

                {/* Karty */}
                <div className="p-6 overflow-x-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {inquiry.lawyers?.map((lawyer: any, index: number) => (
                      <div key={index} className="border border-slate-800 bg-slate-950/50 rounded-xl p-6 hover:border-amber-500/50 hover:shadow-lg transition-all group relative">
                        
                        <div className="mb-6">
                          <h4 className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors">{lawyer.name}</h4>
                          <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3" /> {lawyer.city || "ČR"}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <span className="text-xs text-slate-500 font-bold uppercase">Cena / hod</span>
                            <span className="font-bold text-amber-500">{lawyer.offer?.price} Kč</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-800">
                            <span className="text-xs text-slate-500 font-bold uppercase">Dostupnost</span>
                            <span className="font-bold text-white">{lawyer.offer?.availability}</span>
                          </div>
                          
                          <p className="text-sm text-slate-400 italic py-2">"{lawyer.offer?.message}"</p>

                          <button className="w-full mt-2 bg-slate-800 hover:bg-white hover:text-slate-900 text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                             Akceptovat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
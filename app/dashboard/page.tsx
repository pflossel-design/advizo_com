"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Banknote, Calendar, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inquiries")
      .then(res => res.json())
      .then(data => {
        setInquiries(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Načítám dashboard...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Moje poptávky</h1>
          <Link href="/" className="flex items-center text-blue-600 font-medium hover:underline">
            <ArrowLeft className="w-4 h-4 mr-1" /> Nové hledání
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-slate-500">Zatím jste neodeslali žádnou poptávku.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                {/* Hlavička poptávky */}
                <div className="bg-slate-800 text-white p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold">Poptávka ze dne {new Date(inquiry.date).toLocaleDateString()}</h2>
                      <p className="text-slate-400 text-sm mt-1">{inquiry.message}</p>
                    </div>
                    <span className="bg-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {inquiry.lawyers.length} Nabídek
                    </span>
                  </div>
                </div>

                {/* Srovnávací tabulka */}
                <div className="p-6 overflow-x-auto">
                  <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wide">Porovnání odpovědí advokátů</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {inquiry.lawyers.map((lawyer: any, index: number) => (
                      <div key={index} className="border border-slate-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all bg-slate-50/50">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-lg text-slate-900">{lawyer.name}</h4>
                          {lawyer.offer.price < 2000 && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">Nejlepší cena</span>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Banknote className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500 uppercase">Hodinová sazba</p>
                              <p className="font-semibold text-slate-900">{lawyer.offer.price} Kč / hod</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="text-xs text-slate-500 uppercase">Dostupnost</p>
                              <p className="font-semibold text-slate-900">{lawyer.offer.availability}</p>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-600 italic">
                            "{lawyer.offer.message}"
                          </div>

                          <button className="w-full mt-4 bg-slate-900 hover:bg-black text-white py-2 rounded-lg font-medium transition-colors">
                            Vybrat tohoto právníka
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
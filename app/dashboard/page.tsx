"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Banknote, Calendar, CheckCircle, MapPin, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/inquiries")
      .then(res => res.json())
      .then(data => {
        // Bezpečnostní kontrola: Přišlo pole?
        if (data.data && Array.isArray(data.data)) {
          setInquiries(data.data);
        } else {
          setInquiries([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Nepodařilo se načíst data.");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-500 animate-pulse">Načítám vaše poptávky...</div>
    </div>
  );

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
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <p className="text-slate-500 mb-4">Zatím jste neodeslali žádnou poptávku.</p>
            <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Najít právníka
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {inquiries.map((inquiry: any) => (
              <div key={inquiry.id || Math.random()} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                {/* Hlavička */}
                <div className="bg-slate-900 text-white p-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Poptávka: {inquiry.message ? inquiry.message.substring(0, 40) + "..." : "Bez popisu"}
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        Email: {inquiry.email || "Neuveden"} • Datum: {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : "Neznámé"}
                      </p>
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start md:self-center">
                      {(inquiry.lawyers && Array.isArray(inquiry.lawyers)) ? inquiry.lawyers.length : 0} Nabídek
                    </span>
                  </div>
                </div>

                {/* Srovnávací tabulka */}
                <div className="p-6 overflow-x-auto">
                  <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wide border-b pb-2">
                    Porovnání odpovědí advokátů
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Bezpečná smyčka s kontrolou existence dat */}
                    {inquiry.lawyers && Array.isArray(inquiry.lawyers) && inquiry.lawyers.length > 0 ? (
                      inquiry.lawyers.map((lawyer: any, index: number) => (
                        <div key={index} className="border border-slate-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all bg-slate-50 relative group">
                          
                          <div className="mb-4">
                            <h4 className="font-bold text-lg text-slate-900 leading-tight mb-1">{lawyer.name || "Neznámý právník"}</h4>
                            <p className="text-sm text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {lawyer.city || "ČR"}
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100">
                              <Banknote className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Odhad ceny</p>
                                <p className="font-bold text-slate-900">{lawyer.offer?.price || "Dohodou"} Kč</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Dostupnost</p>
                                <p className="font-bold text-slate-900">{lawyer.offer?.availability || "Dle domluvy"}</p>
                              </div>
                            </div>

                            <div className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-600 italic">
                              "{lawyer.offer?.message || "Mám zájem o váš případ."}"
                            </div>

                            <button className="w-full mt-4 bg-slate-900 group-hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                               Vybrat <CheckCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        U této poptávky nejsou uloženi žádní právníci.
                      </div>
                    )}
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
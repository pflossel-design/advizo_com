"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle, Scale } from "lucide-react";
import Link from "next/link";

export default function InquiryPage() {
  const router = useRouter();
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("selectedLawyers");
    if (data) setLawyers(JSON.parse(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const payload = { ...Object.fromEntries(formData.entries()), lawyers };

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSent(true);
        localStorage.removeItem("selectedLawyers");
      }
    } catch (err) { alert("Chyba při odesílání"); } 
    finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-200">
        <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-800 max-w-md text-center">
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Poptávka odeslána</h2>
          <p className="text-slate-400 mb-6">Vaše žádost pro {lawyers.length} advokátů byla úspěšně zpracována.</p>
          <div className="space-y-3">
             <Link href="/dashboard" className="block w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-all">
              Přejít do Dashboardu
            </Link>
            <Link href="/" className="block text-slate-500 hover:text-amber-500 text-sm font-medium">
              Zpět na vyhledávání
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-slate-200">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-amber-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Zpět na výběr
        </button>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Seznam vybraných */}
          <div className="md:col-span-1">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4">Vybraní experti</h3>
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              {lawyers.map((l, i) => (
                <div key={i} className="p-4 border-b border-slate-800 last:border-0">
                  <div className="font-bold text-white">{l.name}</div>
                  <div className="text-slate-500 text-xs mt-1">{l.city || l.address}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulář */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-6 md:p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Scale className="text-amber-500 w-5 h-5" /> Detaily případu
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vaše jméno</label>
                  <input name="name" required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none text-white placeholder-slate-600 transition-all" placeholder="Jan Novák" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 outline-none text-white placeholder-slate-600" placeholder="jan@email.cz" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Telefon</label>
                    <input name="phone" type="tel" required className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 outline-none text-white placeholder-slate-600" placeholder="+420 777..." />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Popis situace</label>
                  <textarea name="message" required rows={5} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:border-amber-500 outline-none text-white placeholder-slate-600" placeholder="Popište stručně váš právní problém..."></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full mt-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                  {loading ? "Odesílám..." : <><Send className="w-4 h-4" /> Odeslat poptávku</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
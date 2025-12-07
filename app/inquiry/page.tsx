"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function InquiryPage() {
  const router = useRouter();
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Načtení vybraných právníků z paměti při startu
  useEffect(() => {
    const data = localStorage.getItem("selectedLawyers");
    if (data) {
      const parsed = JSON.parse(data);
      console.log("Načteni právníci z paměti:", parsed); // Kontrolní výpis
      setLawyers(parsed);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Získání dat z formuláře (Jméno, Email...)
    const formData = new FormData(e.target as HTMLFormElement);
    const formProps = Object.fromEntries(formData.entries());

    // 2. DŮLEŽITÉ: Spojíme data z formuláře + seznam právníků
    const payload = {
      ...formProps,
      lawyers: lawyers // Tady musíme poslat to pole právníků!
    };

    console.log("Odesílám data na server:", payload);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        setSent(true);
        // Vyčistíme výběr, aby to nepletlo příště
        localStorage.removeItem("selectedLawyers");
      } else {
        alert("Server odmítl data.");
      }
    } catch (err) {
      alert("Chyba při odesílání");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Poptávka odeslána!</h2>
          <p className="text-slate-600 mb-6">Vaše poptávka pro {lawyers.length} advokátů byla uložena.</p>
          
          <div className="space-y-3">
             <Link href="/dashboard" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
              Přejít do Dashboardu
            </Link>
            <Link href="/" className="block text-slate-500 font-medium hover:underline text-sm">
              Zpět na vyhledávání
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-slate-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Zpět na výběr
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Nová poptávka</h1>
        <p className="text-slate-600 mb-8">Poptáváte právní služby u {lawyers.length} vybraných advokátů.</p>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Seznam vybraných (jen pro kontrolu) */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Vybraní právníci</h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {lawyers.length === 0 ? (
                <p className="p-4 text-sm text-red-500">Nikdo nebyl vybrán!</p>
              ) : (
                lawyers.map((l, i) => (
                  <div key={i} className="p-3 border-b border-slate-50 last:border-0 text-sm">
                    <div className="font-medium text-slate-900">{l.name}</div>
                    <div className="text-slate-500 text-xs">{l.city || l.address}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Formulář */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Detaily případu</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vaše jméno</label>
                  <input name="name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Jan Novák" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input name="email" type="email" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="jan@email.cz" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
                    <input name="phone" type="tel" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+420 777..." />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Popis situace</label>
                  <textarea name="message" required rows={5} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Popište stručně váš právní problém..."></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4">
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
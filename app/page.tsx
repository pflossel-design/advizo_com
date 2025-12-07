"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, CheckSquare, ArrowRight, Scale } from "lucide-react";

// Dynamický import mapy
import dynamic from "next/dynamic";
const LawyerMap = dynamic(() => import("./components/Map"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-slate-900 animate-pulse rounded-2xl flex items-center justify-center text-slate-500">Načítám mapu...</div>
});

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedLawyers, setSelectedLawyers] = useState<any[]>([]);
  const [searchedCity, setSearchedCity] = useState("");
  const [formData, setFormData] = useState({
    specialization: "Občanské právo",
    city: "",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSelectedLawyers([]); 
    setSearchedCity(formData.city);
    
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      }
    } catch (error) {
      alert("Chyba serveru");
    } finally {
      setLoading(false);
    }
  };

  const toggleLawyer = (lawyer: any) => {
    if (selectedLawyers.some(l => l.name === lawyer.name)) {
      setSelectedLawyers(selectedLawyers.filter(l => l.name !== lawyer.name));
    } else {
      setSelectedLawyers([...selectedLawyers, lawyer]);
    }
  };

  const goToInquiry = () => {
    localStorage.setItem("selectedLawyers", JSON.stringify(selectedLawyers));
    router.push("/inquiry");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 font-sans pb-32">
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3 tracking-wide">
            <Scale className="text-amber-500 w-8 h-8" />
            <span>ADVIZO<span className="text-amber-500">.</span></span>
          </h1>
          <div className="text-xs font-medium text-slate-500 uppercase tracking-widest hidden md:block">
            Premium Legal Services
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-12">
        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600"></div>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 relative z-10">
            <div className="md:col-span-4 relative">
              <Briefcase className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
              <select className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:border-amber-500 outline-none text-slate-200" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})}>
                <option>Občanské právo</option>
                <option>Trestní právo</option>
                <option>Rodinné právo</option>
                <option>Obchodní právo</option>
              </select>
            </div>
            <div className="md:col-span-5 relative">
              <MapPin className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
              <input type="text" placeholder="Město (např. Praha)" className="w-full pl-12 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:border-amber-500 outline-none text-slate-200" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
            </div>
            <button type="submit" disabled={loading} className="md:col-span-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm">{loading ? "Hledám..." : "Vyhledat"}</button>
          </form>
        </div>

        {results.length > 0 && (
          <div className="mb-8 animate-in fade-in zoom-in duration-500">
             <LawyerMap lawyers={results} city={searchedCity} />
          </div>
        )}

        <div className="grid gap-4">
          {results.map((lawyer, index) => {
            const isSelected = selectedLawyers.some(l => l.name === lawyer.name);
            return (
              <div key={index} onClick={() => toggleLawyer(lawyer)} className={`relative p-6 rounded-xl border cursor-pointer transition-all ${isSelected ? "bg-slate-900/80 border-amber-500 shadow-amber-900/20 shadow-lg" : "bg-slate-900 border-slate-800 hover:border-slate-600"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`text-xl font-bold ${isSelected ? "text-amber-400" : "text-slate-100"}`}>{lawyer.name}</h3>
                    <p className="text-slate-400 mt-2 flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-slate-600" /> {lawyer.address}</p>
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-950 border border-slate-800 text-slate-400">{lawyer.specialization}</div>
                  </div>
                  <div className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${isSelected ? "bg-amber-500 border-amber-500 scale-110" : "border-slate-700 bg-slate-950"}`}>{isSelected && <CheckSquare className="w-4 h-4 text-slate-900" />}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedLawyers.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 shadow-2xl p-6 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <p className="font-bold text-white text-lg">{selectedLawyers.length} kanceláří</p>
            <button onClick={goToInquiry} className="bg-white text-slate-900 font-bold py-3 px-8 rounded-xl shadow-xl flex items-center gap-2">Pokračovat <ArrowRight className="w-5 h-5" /></button>
          </div>
        </div>
      )}
    </main>
  );
}
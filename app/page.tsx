"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase, CheckSquare, ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedLawyers, setSelectedLawyers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    specialization: "Občanské právo",
    city: "",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSelectedLawyers([]); 
    
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
      alert("Chyba při komunikaci se serverem");
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
    <main className="min-h-screen bg-slate-50 pb-24 font-sans relative">
      
      {/* Hlavička */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded">CZ</span> PrávníPoptávka
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Vyhledávací box */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Vyhledat právní pomoc</h2>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="md:col-span-4 relative">
              <Briefcase className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              <select 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.specialization}
                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
              >
                <option>Občanské právo</option>
                <option>Trestní právo</option>
                <option>Rodinné právo</option>
                <option>Obchodní právo</option>
                <option>Generální praxe</option>
              </select>
            </div>

            <div className="md:col-span-5 relative">
              <MapPin className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Město (např. Praha)"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              {loading ? "Hledám..." : "Vyhledat"}
            </button>
          </form>
        </div>

        {/* Výsledky */}
        <div className="grid gap-4">
          {results.length > 0 && <p className="text-slate-500">Nalezeno {results.length} právníků v naší databázi:</p>}
          
          {results.map((lawyer, index) => {
            const isSelected = selectedLawyers.some(l => l.name === lawyer.name);
            return (
              <div 
                key={index} 
                onClick={() => toggleLawyer(lawyer)} 
                className={`relative p-6 rounded-xl border cursor-pointer transition-all ${isSelected ? "bg-blue-50 border-blue-500 shadow-md" : "bg-white border-slate-100 shadow-sm hover:border-blue-300"}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{lawyer.name}</h3>
                    <p className="text-slate-500 mt-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> {lawyer.address}</p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">{lawyer.specialization}</div>
                  </div>
                  <div className={`w-6 h-6 rounded border flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"}`}>
                    {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Plovoucí spodní panel */}
      {selectedLawyers.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg p-4 animate-in slide-in-from-bottom duration-300 z-50">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div>
              <p className="font-semibold text-slate-900">Vybráno: {selectedLawyers.length}</p>
            </div>
            <button onClick={goToInquiry} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
              Vytvořit poptávku <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
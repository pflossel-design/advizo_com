import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log("📨 Backend přijal data. Počet právníků:", data.lawyers?.length);

    if (!data.lawyers || data.lawyers.length === 0) {
        return NextResponse.json({ success: false, error: "Žádní právníci nebyli vybráni" }, { status: 400 });
    }
    
    // Zpracování: Vezmeme PŘESNĚ ty právníky, co přišli z frontendu
    const lawyersWithOffers = data.lawyers.map((lawyer: any) => ({
      name: lawyer.name,        // Musíme zachovat jméno!
      address: lawyer.address,  // I adresu
      city: lawyer.city,
      
      // Přidáme jen fiktivní nabídku (cenu), protože reálný email zatím neposíláme
      offer: {
        price: Math.floor(Math.random() * (3500 - 1500) + 1500),
        availability: ["Ihned", "Do týdne", "Příští měsíc"][Math.floor(Math.random() * 3)],
        message: `Dobrý den, jako zástupce kanceláře ${lawyer.name} potvrzuji zájem o váš případ.`
      }
    }));

    // Uložíme do Supabase
    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
          lawyers: lawyersWithOffers // Ukládáme to, co jsme zpracovali výše
        }
      ]);

    if (error) {
      console.error("Chyba Supabase:", error);
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Chyba serveru:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
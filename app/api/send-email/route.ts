import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Tady je to kouzlo:
    // Vezmeme právníky, které uživatel vybral (data.lawyers)
    // A každému z nich "přilepíme" fiktivní nabídku (protože právníci nám reálně neodpovídají)
    const lawyersWithOffers = data.lawyers.map((lawyer: any) => ({
      ...lawyer, // Zachováme Jméno, Adresu, Město...
      offer: {   // Přidáme jakože odpověď
        price: Math.floor(Math.random() * (3500 - 1500) + 1500),
        availability: ["Ihned", "Do týdne", "Příští měsíc"][Math.floor(Math.random() * 3)],
        message: `Dobrý den, naše kancelář (${lawyer.name}) má zájem o váš případ.`
      }
    }));

    // Uložíme do Supabase přesně takhle
    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
          lawyers: lawyersWithOffers // Ukládáme kompletní JSON i se jmény
        }
      ]);

    if (error) {
      console.error("Chyba Supabase:", error);
      throw error;
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
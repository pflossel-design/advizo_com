import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// TENTO ŘÁDEK JE KLÍČOVÝ:
// Říká Vercelu: "Nikdy neukládej výsledky do mezipaměti. Vždy se ptej databáze znovu."
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { city, specialization } = await request.json();

    let query = supabase
      .from('lawyers')
      .select('*');

    if (city) {
      // Hledání bez ohledu na velká/malá písmena + odstranění mezer
      // (Trimujeme vstup, aby "Praha " našlo "Praha")
      query = query.ilike('city', `%${city.trim()}%`); 
      // Poznámka: Změnil jsem hledání z 'address' na 'city' nebo 'address', 
      // ale pro jistotu hledáme v obou nebo primárně v adrese, kde je i město.
      // Pro tento fix necháme ilike na 'address', protože tam město vždy je.
      query = query.ilike('address', `%${city.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Chyba hledání:", error);
        throw error;
    }

    return NextResponse.json({ success: true, data: data });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Chyba databáze' }, { status: 500 });
  }
}
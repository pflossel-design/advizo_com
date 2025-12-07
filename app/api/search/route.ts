import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { city, specialization } = await request.json();

    // 1. Připravíme dotaz do databáze
    let query = supabase
      .from('lawyers')
      .select('*');

    // 2. Pokud uživatel zadal město, vyfiltrujeme výsledky
    if (city) {
      // 'ilike' znamená hledání bez ohledu na velká/malá písmena (Praha = praha)
      query = query.ilike('address', `%${city}%`);
    }

    // 3. Spustíme dotaz
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
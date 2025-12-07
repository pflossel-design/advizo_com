import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generování nabídek (stejné jako dřív)
    const lawyersWithOffers = data.lawyers.map((lawyer: any) => ({
      ...lawyer,
      offer: {
        price: Math.floor(Math.random() * (3500 - 1500) + 1500),
        availability: ["Ihned", "Do týdne", "Příští měsíc"][Math.floor(Math.random() * 3)],
        message: "Dobrý den, na základě vašeho popisu mám zájem o spolupráci."
      }
    }));

    // ZÁPIS DO SUPABASE
    const { error } = await supabase
      .from('inquiries')
      .insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
          lawyers: lawyersWithOffers
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
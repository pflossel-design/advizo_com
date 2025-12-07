import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; // Důležité: Aby se data načítala vždy čerstvá

export async function GET() {
  // SKUTEČNÉ ČTENÍ Z DATABÁZE SUPABASE
  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Chyba při čtení:", error);
    return NextResponse.json({ data: [] });
  }
  
  return NextResponse.json({ data: data });
}
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Na Vercelu nemůžeme zapisovat do souborů (read-only system).
    // Pro ukázku jen vypíšeme data do logu serveru.
    console.log("📨 POPTÁVKA (Demo):", data.email, data.message);

    // Simulace chvilkového čekání
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Vrátíme úspěch, i když jsme nic neuložili na disk
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Chyba:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
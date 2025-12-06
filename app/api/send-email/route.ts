import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cesta k naší "databázi" (soubor db.json)
const DB_PATH = path.join(process.cwd(), 'db.json');

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // 1. Přidáme každému právníkovi fiktivní odpověď (abychom měli co porovnávat)
    const lawyersWithOffers = data.lawyers.map((lawyer: any) => ({
      ...lawyer,
      offer: {
        price: Math.floor(Math.random() * (3500 - 1500) + 1500), // Náhodná cena 1500-3500 Kč/hod
        availability: ["Ihned", "Do týdne", "Příští měsíc"][Math.floor(Math.random() * 3)],
        message: "Dobrý den, specializuji se na tento typ případů. Rád vám pomohu."
      }
    }));

    // 2. Vytvoříme záznam poptávky
    const newInquiry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      user: { name: data.name, email: data.email },
      message: data.message,
      lawyers: lawyersWithOffers
    };

    // 3. Načteme existující data (pokud jsou)
    let dbData = [];
    if (fs.existsSync(DB_PATH)) {
      const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
      dbData = JSON.parse(fileContent);
    }

    // 4. Přidáme novou a uložíme zpět
    dbData.push(newInquiry);
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Chyba při ukládání:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
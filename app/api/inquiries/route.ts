import { NextResponse } from 'next/server';

export async function GET() {
  // Protože na Vercelu nemáme databázi, vrátíme ukázková data,
  // aby uživatel viděl, jak Dashboard vypadá.
  
  const demoData = [
    {
      id: "demo-1",
      date: new Date().toISOString(),
      user: { name: "Ukázkový Uživatel", email: "demo@email.cz" },
      message: "Toto je ukázková poptávka, protože na Vercelu (Free) nelze ukládat do souborů.",
      lawyers: [
        {
          name: "JUDr. Jan Novák",
          offer: {
            price: 2500,
            availability: "Ihned",
            message: "Mám zájem o zastupování."
          }
        },
        {
          name: "AK Svoboda",
          offer: {
            price: 1800,
            availability: "Do týdne",
            message: "Specializujeme se na tento obor."
          }
        }
      ]
    }
  ];
  
  return NextResponse.json({ data: demoData });
}
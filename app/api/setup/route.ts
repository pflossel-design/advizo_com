import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { supabase } from '@/lib/supabase';

export const maxDuration = 60; 

export async function POST(request: Request) {
  console.log("🤖 START: Spouštím SETUP robota...");
  
  let browser;
  try {
    // Spustíme viditelné okno prohlížeče
    browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Jdeme na ČAK
    console.log("🤖 Jdu na ČAK...");
    await page.goto('https://vyhledavac.cak.cz', { waitUntil: 'networkidle2' });

    // Klikneme na Hledat (pokud tam je)
    try {
        const searchBtn = await page.$('button[type="submit"]');
        if (searchBtn) {
            await searchBtn.click();
            await new Promise(r => setTimeout(r, 3000));
        }
    } catch (e) { console.log("Pokračuji bez klikání..."); }

    // Stahujeme data
    console.log("🤖 Čtu data...");
    const scrapedLawyers = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div.result, div.card, .list-group-item')); 
        return cards.map((card: any) => {
            const lines = card.innerText.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
            return {
                name: lines[0] || "Neznámý právník",
                address: lines.find((l: string) => l.includes("Praha") || l.includes("Brno")) || "Adresa neuvedena",
                specialization: "Generální praxe", 
                city: "Praha"
            };
        });
    });

    // Uložíme do Supabase
    if (scrapedLawyers.length > 0) {
        const { error } = await supabase.from('lawyers').insert(scrapedLawyers);
        if (error) throw error;
    }

    console.log("✅ HOTOVO.");
    await browser.close();
    return NextResponse.json({ success: true, count: scrapedLawyers.length });

  } catch (error: any) {
    if (browser) await browser.close();
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
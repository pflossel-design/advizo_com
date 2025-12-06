import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

export async function GET() {
  if (!fs.existsSync(DB_PATH)) {
    return NextResponse.json({ data: [] });
  }
  
  const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
  const data = JSON.parse(fileContent);
  
  // Seřadíme od nejnovější
  return NextResponse.json({ data: data.reverse() });
}
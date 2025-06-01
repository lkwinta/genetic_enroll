import { NextResponse } from 'next/server';
import { readdirSync } from 'fs';
import path from 'path';

export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'csv');
  const csvFiles = readdirSync(dir).filter(f => f.endsWith('.csv'));
  return NextResponse.json(csvFiles);
}
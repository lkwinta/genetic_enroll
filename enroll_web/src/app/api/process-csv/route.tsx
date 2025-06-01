import { NextRequest, NextResponse } from 'next/server';
import Papa from 'papaparse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if file is CSV
    if (!file.type.includes('csv') && !file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json({ error: 'File must be a CSV' }, { status: 400 });
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large' }, { status: 400 });
    }

    // Read file content
    const fileContent = await file.text();

    // Parse CSV with Papa Parse
    const parseResult = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      delimitersToGuess: [',', '\t', '|', ';'],
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json({ 
        error: 'CSV parsing failed', 
        details: parseResult.errors 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: parseResult.data,
      meta: parseResult.meta,
      rowCount: parseResult.data.length,
    });

  } catch (error) {
    console.error('CSV processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
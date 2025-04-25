import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to public directory
    const publicPath = join(process.cwd(), 'public', 'uploads');
    const filename = `${Date.now()}-${file.name}`;
    const filePath = join(publicPath, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json(
      { 
        message: 'File uploaded successfully',
        url: `/uploads/${filename}`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Upload endpoint ready' },
    { status: 200 }
  );
}

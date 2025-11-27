import { NextRequest, NextResponse } from 'next/server';
import uploadService from '@/services/uploadService';

export async function GET() {
  try {
    const documents = await uploadService.getAllDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    console.error('❌ Erro ao obter documentos:', error);
    return NextResponse.json(
      { error: 'Erro ao obter documentos' },
      { status: 500 }
    );
  }
}

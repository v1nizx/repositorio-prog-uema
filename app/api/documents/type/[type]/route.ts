import { NextRequest, NextResponse } from 'next/server';
import uploadService from '@/services/uploadService';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const { type } = params;
    const documents = await uploadService.getDocumentsByType(decodeURIComponent(type));

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Erro ao obter documentos por tipo:', error);
    return NextResponse.json(
      { error: 'Erro ao obter documentos' },
      { status: 500 }
    );
  }
}

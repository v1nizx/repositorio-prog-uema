import { NextRequest, NextResponse } from 'next/server';
import uploadService from '@/services/uploadService';

export async function GET(
  request: NextRequest,
  { params }: { params: { sector: string } }
) {
  try {
    const { sector } = params;
    const documents = await uploadService.getDocumentsBySector(decodeURIComponent(sector));

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Erro ao obter documentos por setor:', error);
    return NextResponse.json(
      { error: 'Erro ao obter documentos' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import uploadService from '@/services/uploadService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query de busca não fornecida' },
        { status: 400 }
      );
    }

    const results = await uploadService.searchDocuments(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar documentos' },
      { status: 500 }
    );
  }
}

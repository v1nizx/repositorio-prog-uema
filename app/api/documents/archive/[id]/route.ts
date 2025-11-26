import { NextRequest, NextResponse } from 'next/server';
import uploadService from '@/services/uploadService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await uploadService.archiveDocument(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao arquivar documento:', error);
    return NextResponse.json(
      { error: 'Erro ao arquivar documento' },
      { status: 500 }
    );
  }
}

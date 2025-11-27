import { NextRequest, NextResponse } from 'next/server';
import uploadService, { UploadDocument } from '@/services/uploadService';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const documents = await uploadService.getAllDocuments();
    const document = documents.find((doc: UploadDocument) => doc.id === id);

    if (!document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Erro ao obter documento:', error);
    return NextResponse.json(
      { error: 'Erro ao obter documento' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    await uploadService.updateDocument(id, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar documento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar documento' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await uploadService.deleteDocument(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar documento:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar documento' },
      { status: 500 }
    );
  }
}

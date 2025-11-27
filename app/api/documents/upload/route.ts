import { NextRequest, NextResponse } from 'next/server';
import uploadService from '@/services/uploadService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const type = formData.get('type') as string;
    const author = formData.get('author') as string;
    const sector = formData.get('sector') as string;
    const description = formData.get('description') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      );
    }

    if (!title || !type || !author || !sector) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Validar tipo de arquivo
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use PDF, DOCX ou XLSX' },
        { status: 400 }
      );
    }

    // Validar tamanho do arquivo (máximo 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 50MB' },
        { status: 400 }
      );
    }

    const uploadedDocument = await uploadService.uploadFile(file, {
      titulo: title,
      tipo: type,
      autor: author,
      setor: sector,
      descricao: description,
      nomeArquivo: file.name,
      tamanhoArq: file.size,
      versao: 1,
      status: 'ativo',
    });

    return NextResponse.json(uploadedDocument, { status: 201 });
  } catch (error) {
    console.error('❌ Erro no endpoint de upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao fazer upload' },
      { status: 500 }
    );
  }
}

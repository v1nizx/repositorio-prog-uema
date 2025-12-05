import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/config/firebase-admin.config';

interface DeleteAccountRequest {
  userId: string;
  password: string;
}

interface DeleteAccountResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * DELETE /api/auth/delete-account
 * Deleta a conta do usuário após verificar a senha
 */
export async function DELETE(request: NextRequest): Promise<NextResponse<DeleteAccountResponse>> {
  try {
    const body = await request.json() as DeleteAccountRequest;
    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        { success: false, error: 'ID do usuário e senha são obrigatórios' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Tentando deletar conta: ${userId}`);

    const db = getFirestoreDb();
    const usersCollection = db.collection('users');
    
    // Buscar usuário por ID
    const userDoc = await usersCollection.doc(userId).get();
    
    if (!userDoc.data()) {
      console.log(`❌ Usuário não encontrado: ${userId}`);
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Verificar senha
    if (userData?.password !== password) {
      console.log(`❌ Senha incorreta para exclusão: ${userId}`);
      return NextResponse.json(
        { success: false, error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    // Deletar usuário
    await usersCollection.doc(userId).delete();
    
    console.log(`✅ Conta deletada com sucesso: ${userId}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Conta deletada com sucesso',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erro ao deletar conta:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar conta' },
      { status: 500 }
    );
  }
}

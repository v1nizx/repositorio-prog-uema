import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/config/firebase-admin.config';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: {
    id: string;
    username: string;
    role: string;
    name: string;
    email: string;
  };
  error?: string;
}

/**
 * POST /api/auth/login
 * Autentica um usuário com username e senha
 */
export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json() as LoginRequest;
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username e senha são obrigatórios' },
        { status: 400 }
      );
    }

    console.log(`🔍 Tentando login para usuário: ${username}`);

    // Buscar usuário no Firestore usando Admin SDK
    const db = getFirestoreDb();
    const usersCollection = db.collection('users');
    const querySnapshot = await usersCollection.where('username', '==', username).get();

    if (querySnapshot.empty) {
      console.log(`❌ Usuário não encontrado: ${username}`);
      return NextResponse.json(
        { success: false, error: 'Usuário ou senha inválidos' },
        { status: 401 }
      );
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Comparar senha (em produção, usar bcrypt ou similar)
    if (userData.password !== password) {
      console.log(`❌ Senha incorreta para usuário: ${username}`);
      return NextResponse.json(
        { success: false, error: 'Usuário ou senha inválidos' },
        { status: 401 }
      );
    }

    console.log(`✅ Login bem-sucedido para: ${username}`);

    // Retornar dados do usuário sem a senha
    return NextResponse.json(
      {
        success: true,
        user: {
          id: userDoc.id,
          username: userData.username,
          role: userData.role,
          name: userData.name,
          email: userData.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erro no login:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}

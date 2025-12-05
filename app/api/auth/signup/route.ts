import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/config/firebase-admin.config';

interface SignupRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  role?: string;
}

interface SignupResponse {
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
 * POST /api/auth/signup
 * Cria uma nova conta de usuário
 */
export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse>> {
  try {
    const body = await request.json() as SignupRequest;
    const { username, password, name, email, role = 'usuario' } = body;

    // Validações básicas
    if (!username || !password || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Username deve ter pelo menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    console.log(`📝 Tentando criar novo usuário: ${username}`);

    // Buscar se já existe usuário com este username
    const db = getFirestoreDb();
    const usersCollection = db.collection('users');
    
    const usernameQuery = await usersCollection.where('username', '==', username).get();
    if (!usernameQuery.empty) {
      console.log(`❌ Username já existe: ${username}`);
      return NextResponse.json(
        { success: false, error: 'Username já está em uso' },
        { status: 409 }
      );
    }

    // Verificar se email já existe
    const emailQuery = await usersCollection.where('email', '==', email).get();
    if (!emailQuery.empty) {
      console.log(`❌ Email já está registrado: ${email}`);
      return NextResponse.json(
        { success: false, error: 'Email já está registrado' },
        { status: 409 }
      );
    }

    // Criar novo usuário
    const newUser = {
      username,
      password, // ⚠️ Em produção, usar bcrypt para hash
      name,
      email,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await usersCollection.add(newUser);
    
    console.log(`✅ Usuário criado com sucesso: ${username} (ID: ${docRef.id})`);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: docRef.id,
          username,
          role,
          name,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}

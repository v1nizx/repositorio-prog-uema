import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/config/firebase-admin.config';

interface InitResponse {
  success: boolean;
  message: string;
  usersCreated?: number;
  error?: string;
}

const INITIAL_USERS = [
  {
    id: 'admin-001',
    username: 'admin',
    password: 'admin123',
    name: 'Administrador',
    email: 'admin@universidade.edu.br',
    role: 'admin',
  },
  {
    id: 'coord-001',
    username: 'coordenador',
    password: 'coord123',
    name: 'João Coordenador',
    email: 'coordenador@universidade.edu.br',
    role: 'coordenador',
  },
  {
    id: 'user-001',
    username: 'usuario',
    password: 'user123',
    name: 'Maria Usuária',
    email: 'usuario@universidade.edu.br',
    role: 'usuario',
  },
];

/**
 * POST /api/init
 * Inicializa os usuários de teste (apenas para desenvolvimento)
 */
export async function POST(request: NextRequest): Promise<NextResponse<InitResponse>> {
  try {
    const db = getFirestoreDb();
    
    // Verificar se já existem usuários
    const existingUsers = await db.collection('users').get();

    if (!existingUsers.empty) {
      return NextResponse.json(
        { success: true, message: 'Usuários já existem no banco de dados' },
        { status: 200 }
      );
    }

    // Criar usuários iniciais
    let usersCreated = 0;
    for (const user of INITIAL_USERS) {
      await db.collection('users').doc(user.id).set({
        username: user.username,
        password: user.password,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      usersCreated++;
      console.log(`✅ Usuário criado: ${user.username}`);
    }

    console.log(`✅ ${usersCreated} usuários de teste criados`);

    return NextResponse.json(
      {
        success: true,
        message: `${usersCreated} usuários criados com sucesso`,
        usersCreated,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao inicializar banco de dados', message: '' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/init
 * Também permite GET para facilitar acesso via navegador
 */
export async function GET(request: NextRequest): Promise<NextResponse<InitResponse>> {
  return POST(request);
}

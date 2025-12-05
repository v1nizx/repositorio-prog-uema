import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/config/firebase-admin.config';

interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
}

/**
 * GET /api/users/[id]
 * Obtém informações de um usuário específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const db = getFirestoreDb();
    const userDoc = await db.collection('users').doc(id).get();

    if (!userDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();
    return NextResponse.json(
      {
        success: true,
        user: {
          id: userDoc.id,
          username: userData?.username,
          name: userData?.name,
          email: userData?.email,
          role: userData?.role,
          createdAt: userData?.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erro ao buscar usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar usuário' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id]
 * Atualiza informações de um usuário (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = (await request.json()) as UpdateUserRequest;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const db = getFirestoreDb();
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(`❌ Usuário não encontrado: ${id}`);
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Validar role se fornecido
    const validRoles = ['admin', 'coordenador', 'usuario'];
    if (body.role && !validRoles.includes(body.role)) {
      return NextResponse.json(
        { success: false, error: 'Perfil inválido' },
        { status: 400 }
      );
    }

    // Preparar dados para atualização
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.role) updateData.role = body.role;

    await userRef.update(updateData);

    console.log(`✅ Usuário atualizado: ${id}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Usuário atualizado com sucesso',
        user: {
          id,
          ...updateData,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar usuário' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * Deleta um usuário (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID do usuário é obrigatório' },
        { status: 400 }
      );
    }

    const db = getFirestoreDb();
    const userRef = db.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log(`❌ Usuário não encontrado: ${id}`);
      return NextResponse.json(
        { success: false, error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Impedir auto-deleção
    if (userData?.role === 'admin') {
      console.log(`⚠️ Tentativa de deletar admin: ${id}`);
      return NextResponse.json(
        { success: false, error: 'Não é permitido deletar usuários com perfil de administrador' },
        { status: 403 }
      );
    }

    // Deletar usuário
    await userRef.delete();

    console.log(`✅ Usuário deletado: ${id} (${userData?.username})`);

    return NextResponse.json(
      {
        success: true,
        message: 'Usuário deletado com sucesso',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erro ao deletar usuário:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar usuário' },
      { status: 500 }
    );
  }
}

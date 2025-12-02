import { NextRequest, NextResponse } from 'next/server';
import { getFirestoreDb } from '@/config/firebase-admin.config';

/**
 * GET /api/users
 * Retorna todos os usuários (apenas para admins)
 */
export async function GET(request: NextRequest) {
  try {
    const db = getFirestoreDb();
    const querySnapshot = await db.collection('users').get();

    const users = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        username: data.username,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };
    });

    console.log('✅ Usuários retornados:', users.length);

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('❌ Erro ao obter usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao obter usuários' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

interface LogoutResponse {
  success: boolean;
  message: string;
}

/**
 * POST /api/auth/logout
 * Faz logout do usuário (limpa sessão no cliente)
 */
export async function POST(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    console.log('🔓 Logout realizado');

    // No cliente, o localStorage será limpo
    return NextResponse.json(
      { success: true, message: 'Logout realizado com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Erro no logout:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth/logout
 * Também permite GET para facilitar logout
 */
export async function GET(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  return POST(request);
}

'use client';

import { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';

type AuthMode = 'login' | 'signup';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <>
      {mode === 'login' ? (
        <Login 
          onSwitchToSignup={() => setMode('signup')}
        />
      ) : (
        <Signup 
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </>
  );
}

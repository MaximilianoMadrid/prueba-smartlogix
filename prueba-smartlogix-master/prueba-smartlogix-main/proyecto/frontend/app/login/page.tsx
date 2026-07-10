'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const ok = await login(email, contrasena);
    if (ok) {
      router.push('/dashboard');
    } else {
      setError('Credenciales incorrectas');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-4 border rounded-lg">
        <h1 className="text-2xl font-semibold text-center">SmartLogix</h1>
        <p className="text-center text-muted-foreground">Inicia sesión para continuar</p>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Contraseña"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" onClick={handleLogin} disabled={loading}>
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </Button>
      </div>
    </div>
  );
}
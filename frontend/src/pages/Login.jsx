import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import pb from '@/lib/pb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, Mail, ShieldAlert, Loader2 } from 'lucide-react'

export function Login() {
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await pb.collection('users').authWithPassword(identity, password)
      navigate('/')
    } catch (err) {
      console.error('Error al iniciar sesión:', err)
      setError('Credenciales inválidas. Por favor verifica usuario y contraseña.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-xl border border-border/50">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex justify-center mb-2">
            <img src="/logo-dark.png" className="h-12 w-auto dark:hidden" alt="Logo NODO" />
            <img src="/logo-nodo-reverse.png" className="h-12 w-auto hidden dark:block" alt="Logo NODO" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Acceso al Sistema</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a la plataforma de Soporte Técnico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 text-xs flex items-center gap-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="identity">Usuario o Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identity"
                  type="text"
                  placeholder="usuario@ejemplo.com"
                  className="pl-9"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login

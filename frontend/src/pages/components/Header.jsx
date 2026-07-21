import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SoporteDialog from '@/components/SoporteDialog'
import { ModeToggle } from '@/components/mode-toggle'
import pb from '@/lib/pb'
import { Menu, X, LogOut } from 'lucide-react'

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const user = pb.authStore.model

  const handleLogout = () => {
    pb.authStore.clear()
    navigate('/login')
  }

  const nav = [
    {
      name: 'Inicio',
      href: '/',
    },
    {
      name: 'Personal',
      href: '/tecnicos',
    },
    {
      name: 'Departamentos',
      href: '/departamentos',
    },
    {
      name: 'Estadísticas Técnicos',
      href: '/estadisticas-tecnicos',
    },
    {
      name: 'Historial',
      href: '/historial',
    },
    {
      name: 'Nuevo soporte',
      href: '#',
      className: 'bg-primary text-primary-foreground! px-3.5 py-1.5 rounded-md hover:bg-primary/90 transition-colors inline-block text-center whitespace-nowrap',
    }
  ]

  const currentPath = window.location.pathname
  const userInitial = user ? (user.username || user.email || 'U')[0].toUpperCase() : 'U'

  return (
    <header className="sticky top-0 z-50 shadow-md bg-card/95 backdrop-blur-md text-foreground border-b border-border/40 transition-colors duration-300">
      <div className="container mx-auto flex items-center justify-between py-2.5 px-4">
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/">
            <img src="/logo-dark.png" className="h-8 sm:h-9 w-auto dark:hidden" alt="Logo" />
            <img src="/logo-nodo-reverse.png" className="h-8 sm:h-9 w-auto hidden dark:block" alt="Logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-6">
          <ul className="flex gap-3 2xl:gap-5 items-center">
            {nav.map((item) => {
              const isActive = currentPath === item.href

              if (item.name === 'Nuevo soporte') {
                return (
                  <li key={item.name}>
                    <SoporteDialog>
                      <button className={`font-bold uppercase text-xs tracking-wider ${item.className}`}>
                        {item.name}
                      </button>
                    </SoporteDialog>
                  </li>
                )
              }

              return (
                <li key={item.name}>
                  <Link
                    className={`font-semibold uppercase text-xs tracking-wider whitespace-nowrap transition-colors ${
                      isActive ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted-foreground hover:text-primary'
                    }`}
                    to={item.href}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
          
          <div className="flex items-center gap-3 pl-3 border-l border-border/50">
            <ModeToggle />
            
            {user && (
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs select-none shadow-xs"
                  title={user.username || user.email}
                >
                  {userInitial}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile controls */}
        <div className="flex xl:hidden items-center gap-2.5">
          <ModeToggle />
          
          {user && (
            <div className="flex items-center gap-1.5">
              <div 
                className="w-8 h-8 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs select-none"
                title={user.username || user.email}
              >
                {userInitial}
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md hover:bg-accent text-foreground transition-colors ml-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav className="xl:hidden absolute top-full left-0 w-full border-t border-b border-border/40 bg-card/95 backdrop-blur-md px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200 z-50">
          {user && (
            <div className="flex items-center gap-2.5 px-3 py-2 bg-accent/40 rounded-md border border-border/20 mb-3">
              <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                {userInitial}
              </div>
              <span className="text-xs font-semibold text-foreground truncate">{user.username || user.email}</span>
            </div>
          )}
          <ul className="flex flex-col gap-2.5">
            {nav.map((item) => {
              const isActive = currentPath === item.href

              if (item.name === 'Nuevo soporte') {
                return (
                  <li key={item.name} className="pt-2">
                    <SoporteDialog>
                      <button className={`w-full font-bold uppercase text-xs py-2 ${item.className}`}>
                        {item.name}
                      </button>
                    </SoporteDialog>
                  </li>
                )
              }

              return (
                <li key={item.name}>
                  <Link
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 font-semibold uppercase text-xs rounded-md px-3 transition-colors ${
                      isActive ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                    to={item.href}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}




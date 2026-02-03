import React from 'react'
import { Link, Links } from 'react-router-dom'
import NuevoSoporteDialog from '@/components/NuevoSoporteDialog'
import { ModeToggle } from '@/components/mode-toggle'

export const Header = () => {

  const nav = [
    {
      name: 'Inicio',
      href: '/',
    },
    {
      name: 'Tecnicos',
      href: '/tecnicos',
    },
    {
      name: 'Departamentos',
      href: '/departamentos',
    },
    {
      name: 'Historial',
      href: '/historial',
    },
    {
      name: 'Nuevo soporte',
      href: '#',
      className: 'bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors',
    }
  ]

  const currentPath = window.location.pathname

  return (
    <div className="shadow-md bg-card text-foreground border-b border-border/40 transition-colors duration-300">
      <div className='container mx-auto flex-col gap-4 lg:flex-row flex justify-between items-center py-4 px-4'>
        <div>
          <Link to="/">
            <img src="/logo.webp" className='w-52 md:w-42 dark:brightness-0 dark:invert' alt="Logo" />
          </Link>
        </div>
        <nav>
          <ul className='flex gap-4 items-center'>
            {nav.map((item) => {
              const isActive = currentPath === item.href

              if (item.name === 'Nuevo soporte') {
                return (
                  <li key={item.name}>
                    <NuevoSoporteDialog>
                      <button className={`font-bold uppercase text-sm ${item.className}`}>
                        {item.name}
                      </button>
                    </NuevoSoporteDialog>
                  </li>
                )
              }

              return (
                <li key={item.name}>
                  <Link
                    className={`font-bold uppercase text-sm ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'} ${item.className || ''}`}
                    to={item.href}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
            <li>
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import NuevoSoporteDialog from '@/components/NuevoSoporteDialog'

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
      className: 'bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 hover:text-white transition-colors',
    }
  ]

  const currentPath = window.location.pathname

  return (
    <div className="shadow-md bg-white">
      <div className='container mx-auto flex-col gap-4 lg:flex-row flex justify-between items-center py-4 px-4'>
        <div>
          <img src="/logo.webp" className='w-52 md:w-42' alt="Logo" />
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
                    className={`font-bold uppercase text-sm ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'} ${item.className || ''}`}
                    to={item.href}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}

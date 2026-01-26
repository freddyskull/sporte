import React from 'react'
import { Link } from 'react-router-dom'

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
    }
  ]

  const currentPath = window.location.pathname

  return (
    <div className="shadow-md bg-white">
      <div className='container mx-auto flex justify-between items-center py-4'>
        <div>
          <img src="/logo.webp" width={150} alt="Logo" />
        </div>
        <nav>
          <ul className='flex gap-4'>
            {nav.map((item) => {
              const isActive = currentPath === item.href
              return (
                <li key={item.name}>
                  <Link
                    className={`font-bold uppercase ${isActive ? 'text-primary' : 'text-slate-600 hover:text-primary'}`}
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

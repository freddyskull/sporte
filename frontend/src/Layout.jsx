import { useEffect } from 'react'
import { Header } from './pages/components/Header'
import useTecnicosStore from './stores/tecnicosStore'
import useDepartamentosStore from './stores/departamentosStore'
import useHistorialStore from './stores/historialStore'


export const Layout = ({ children }) => {

  const { fetchTecnicos } = useTecnicosStore()
  const { fetchDepartamentos } = useDepartamentosStore()
  const { fetchHistorial } = useHistorialStore()

  useEffect(() => {
    fetchTecnicos()
    fetchDepartamentos()
    fetchHistorial()
  }, [fetchTecnicos, fetchDepartamentos, fetchHistorial])

  return (
    <div>
      <Header />
      <div className='mx-auto container mt-6 px-4'>
        {children}
      </div>
    </div>
  )
}

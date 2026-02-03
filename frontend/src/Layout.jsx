import { useEffect } from 'react'
import { Header } from './pages/components/Header'
import useTecnicosStore from './stores/tecnicosStore'
import useDepartamentosStore from './stores/departamentosStore'
import useHistorialStore from './stores/historialStore'
import { motion, AnimatePresence } from 'framer-motion'


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
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className='mx-auto container mt-6 px-4'
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

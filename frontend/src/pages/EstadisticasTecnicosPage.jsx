import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout'
import EstadisticasTecnicosRadar from '../components/EstadisticasTecnicosRadar'
import EstadisticasTecnicosDepartamentos from '../components/EstadisticasTecnicosDepartamentos'
import useHistorialStore from '../stores/historialStore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export const EstadisticasTecnicosPage = () => {
  const { historial, fetchHistorial } = useHistorialStore()
  const [selectedTecnico, setSelectedTecnico] = useState(null)
  const [tecnicosList, setTecnicosList] = useState([])

  useEffect(() => {
    fetchHistorial()
  }, [fetchHistorial])

  useEffect(() => {
    if (historial.length) {
      // Extract unique technicians
      const tecnicos = new Map()
      historial.forEach(h => {
        const tecnicosAsociados = h.expand?.tecnicos_asociados || []
        tecnicosAsociados.forEach(t => {
          if (t.id && t.nombre) {
            tecnicos.set(t.id, t.nombre)
          }
        })
      })

      const tecnicosArray = Array.from(tecnicos, ([id, nombre]) => ({ id, nombre }))
      setTecnicosList(tecnicosArray)

      // Auto-select first technician
      if (tecnicosArray.length > 0 && !selectedTecnico) {
        setSelectedTecnico(tecnicosArray[0].id)
      }
    }
  }, [historial])

  const selectedTecnicoName = tecnicosList.find(t => t.id === selectedTecnico)?.nombre || 'Técnico'

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4 flex-col lg:flex-row gap-4">
        <h1 className="text-2xl font-bold uppercase">Estadísticas de Técnicos - {selectedTecnicoName}</h1>
        <Select value={selectedTecnico} onValueChange={setSelectedTecnico}>
          <SelectTrigger className="w-full lg:w-[300px]">
            <SelectValue placeholder="Seleccionar técnico" />
          </SelectTrigger>
          <SelectContent>
            {tecnicosList.map(tecnico => (
              <SelectItem key={tecnico.id} value={tecnico.id}>
                {tecnico.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EstadisticasTecnicosRadar selectedTecnico={selectedTecnico} />
        <EstadisticasTecnicosDepartamentos selectedTecnico={selectedTecnico} />
      </div>
    </Layout>
  )
}

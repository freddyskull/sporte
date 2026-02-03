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
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [availableYears, setAvailableYears] = useState([])

  useEffect(() => {
    fetchHistorial()
  }, [fetchHistorial])

  useEffect(() => {
    if (historial.length) {
      // Extract unique technicians
      const tecnicos = new Map()
      const years = new Set()

      historial.forEach(h => {
        const tecnicosAsociados = h.expand?.tecnicos_asociados || []
        tecnicosAsociados.forEach(t => {
          if (t.id && t.nombre) {
            tecnicos.set(t.id, t.nombre)
          }
        })

        // Extract years
        if (h.fecha_soporte) {
          const year = new Date(h.fecha_soporte).getFullYear()
          years.add(year)
        }
      })

      const tecnicosArray = Array.from(tecnicos, ([id, nombre]) => ({ id, nombre }))
      setTecnicosList(tecnicosArray)
      setAvailableYears(Array.from(years).sort((a, b) => b - a))

      // Auto-select first technician
      if (tecnicosArray.length > 0 && !selectedTecnico) {
        setSelectedTecnico(tecnicosArray[0].id)
      }
    }
  }, [historial])

  const selectedTecnicoName = tecnicosList.find(t => t.id === selectedTecnico)?.nombre || 'Técnico'

  const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ]

  return (
    <Layout>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center flex-col lg:flex-row gap-4">
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

        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filtrar por Año</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los años" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los años</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Filtrar por Mes</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={selectedYear === 'all'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos los meses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los meses</SelectItem>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EstadisticasTecnicosRadar
          selectedTecnico={selectedTecnico}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
        <EstadisticasTecnicosDepartamentos
          selectedTecnico={selectedTecnico}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />
      </div>
    </Layout>
  )
}

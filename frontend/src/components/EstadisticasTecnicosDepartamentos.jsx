import React, { useEffect, useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import useHistorialStore from '../stores/historialStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const EstadisticasTecnicosDepartamentos = ({ selectedTecnico, selectedYear, selectedMonth }) => {
  const { historial, fetchHistorial } = useHistorialStore()
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetchHistorial()
  }, [fetchHistorial])

  useEffect(() => {
    if (selectedTecnico && historial.length) {
      processData(selectedTecnico)
    }
  }, [selectedTecnico, historial, selectedYear, selectedMonth])

  const filterByDate = (historialData) => {
    if (selectedYear === 'all') return historialData

    return historialData.filter(h => {
      if (!h.fecha_soporte) return false

      const date = new Date(h.fecha_soporte)
      const year = date.getFullYear()
      const month = date.getMonth() + 1

      if (year !== parseInt(selectedYear)) return false
      if (selectedMonth !== 'all' && month !== parseInt(selectedMonth)) return false

      return true
    })
  }

  const processData = (tecnicoId) => {
    const filteredHistorial = filterByDate(historial)
    const departamentoCount = {}
    let maxVal = 0

    filteredHistorial.forEach(h => {
      const tecnicosAsociados = h.expand?.tecnicos_asociados || []
      const isTecnicoInSupport = tecnicosAsociados.some(t => t.id === tecnicoId)

      if (isTecnicoInSupport && h.expand?.departamento?.nombre) {
        const deptName = h.expand.departamento.nombre
        departamentoCount[deptName] = (departamentoCount[deptName] || 0) + 1
        if (departamentoCount[deptName] > maxVal) maxVal = departamentoCount[deptName]
      }
    })

    const fullMark = Math.ceil(maxVal * 1.2) || 10

    const data = Object.entries(departamentoCount).map(([department, count]) => ({
      department: capitalize(department),
      count,
      fullMark
    }))

    setChartData(data)
  }

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-950/90 text-slate-50 p-3 rounded-lg shadow-xl text-xs border border-slate-800 backdrop-blur-sm">
          <p className="font-bold mb-1 text-sm capitalize">{data.department}</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Soportes:</span>
            <span className="font-bold">{data.count}</span>
          </div>
        </div>
      )
    }
    return null
  }

  const renderRadarChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex h-[400px] w-full items-center justify-center text-slate-400 font-medium uppercase">
          No hay datos para mostrar
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="department" tick={{ fill: 'var(--foreground)', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar
            name="Soportes"
            dataKey="count"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    )
  }

  const totalSoportes = chartData.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="w-full mx-auto">
          <CardHeader className="px-0 pt-0 pb-4">
            <div className="space-y-1">
              <CardTitle className="text-lg">Departamentos Atendidos</CardTitle>
              <CardDescription>
                {totalSoportes} soportes en {chartData.length} departamentos
              </CardDescription>
            </div>
          </CardHeader>
          {renderRadarChart()}
        </div>
      </CardContent>
    </Card>
  )
}

export default EstadisticasTecnicosDepartamentos

import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useHistorialStore from '../stores/historialStore'
import useTecnicosStore from '../stores/tecnicosStore'
import { Card, CardContent } from '@/components/ui/card'

// Expanded color palette for more technicians
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57',
  '#ffc0cb', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
  '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'
]

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload

    // Fallback manual percent calculation if Recharts doesn't provide it nicely
    // Sometimes percent is undefined in custom tooltip depending on version/context
    let percentVal = 0
    if (payload[0].percent !== undefined) {
      percentVal = payload[0].percent
    } else if (total > 0) {
      percentVal = data.value / total
    }

    return (
      <div className="bg-background/95 border border-border p-3 rounded-md shadow-lg backdrop-blur-sm">
        <p className="font-bold text-foreground mb-1">{data.name}</p>
        <div className="flex flex-col text-sm text-muted-foreground gap-1">
          <span className="flex justify-between gap-4">
            <span>Soportes:</span>
            <span className="font-medium text-foreground">{data.value}</span>
          </span>
          <span className="flex justify-between gap-4">
            <span>Porcentaje:</span>
            <span className="font-medium text-foreground">
              {(percentVal * 100).toFixed(1)}%
            </span>
          </span>
        </div>
      </div>
    )
  }
  return null
}

const EstadisticasTecnicos = () => {
  const { historial, fetchHistorial } = useHistorialStore()
  const { tecnicos, fetchTecnicos } = useTecnicosStore()
  const [data, setData] = useState({ semanal: [], mensual: [], anual: [], general: [] })

  useEffect(() => {
    fetchHistorial()
    fetchTecnicos()
  }, [fetchHistorial, fetchTecnicos])

  useEffect(() => {
    if (historial.length && tecnicos.length) {
      const now = new Date()

      // Helper function for date filtering
      const filterByDate = (items, startDate) => {
        return items.filter(h => {
          if (!h.fecha_soporte) return false
          const datePart = String(h.fecha_soporte).split(/[T ]/)[0]
          const [y, m, d] = datePart.split('-').map(Number)
          const date = new Date(y, m - 1, d)
          return date >= startDate
        })
      }

      // Semanal: Last 7 days (Rolling)
      const last7Days = new Date(now)
      last7Days.setDate(now.getDate() - 7)

      // Mensual: Start of Current Month (1st of month)
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      // Anual: Start of Current Year (Jan 1st)
      const startOfYear = new Date(now.getFullYear(), 0, 1)

      const semanal = filterByDate(historial, last7Days)
      const mensual = filterByDate(historial, startOfMonth)
      const anual = filterByDate(historial, startOfYear)

      setData({
        semanal: processData(semanal),
        mensual: processData(mensual),
        anual: processData(anual),
        general: processData(historial),
      })
    }
  }, [historial, tecnicos])

  const processData = (filteredHistorial) => {
    const tecnicoCount = {}

    filteredHistorial.forEach(h => {
      const tecnicosAsociados = h.expand?.tecnicos_asociados || []
      tecnicosAsociados
        .filter(t => !t.cargo?.toUpperCase().includes('JEFE'))
        .forEach(t => {
          tecnicoCount[t.nombre] = (tecnicoCount[t.nombre] || 0) + 1
        })
    })

    // Sort by value descending for better visualization
    return Object.entries(tecnicoCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }

  const renderPieChart = (chartData) => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground font-medium uppercase text-xs sm:text-sm">
          No hay datos para mostrar
        </div>
      )
    }

    const total = chartData.reduce((sum, item) => sum + item.value, 0)

    return (
      <div className="flex flex-col items-center w-full">
        <div className="h-[240px] sm:h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="stroke-background hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend as responsive badged wrap container */}
        <div className="flex flex-wrap gap-1.5 justify-center max-h-[110px] overflow-y-auto mt-2 p-1 w-full text-xs">
          {chartData.map((entry, index) => (
            <div
              key={entry.name}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent/60 border border-border/50 text-foreground"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium truncate max-w-[100px]">{entry.name}</span>
              <span className="text-muted-foreground font-bold ml-0.5">({entry.value})</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg font-bold uppercase tracking-tight">Estadísticas de Técnicos</h2>
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="semanal" className="text-xs">SEMANAL</TabsTrigger>
              <TabsTrigger value="mensual" className="text-xs">MENSUAL</TabsTrigger>
              <TabsTrigger value="anual" className="text-xs">ANUAL</TabsTrigger>
              <TabsTrigger value="general" className="text-xs">GENERAL</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="semanal" className="mt-0">
            {renderPieChart(data.semanal)}
          </TabsContent>
          <TabsContent value="mensual" className="mt-0">
            {renderPieChart(data.mensual)}
          </TabsContent>
          <TabsContent value="anual" className="mt-0">
            {renderPieChart(data.anual)}
          </TabsContent>
          <TabsContent value="general" className="mt-0">
            {renderPieChart(data.general)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default EstadisticasTecnicos
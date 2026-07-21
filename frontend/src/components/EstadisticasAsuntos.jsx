import React, { useEffect, useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useHistorialStore from '../stores/historialStore'
import { Card, CardContent } from '@/components/ui/card'

const EstadisticasAsuntos = () => {
  const { historial, fetchHistorial } = useHistorialStore()
  const [data, setData] = useState({ semanal: [], mensual: [], anual: [], general: [] })

  useEffect(() => {
    fetchHistorial()
  }, [fetchHistorial])

  useEffect(() => {
    if (historial.length) {
      const now = new Date()

      const filterByDate = (items, startDate) => {
        return items.filter(h => {
          if (!h.fecha_soporte) return false
          return new Date(h.fecha_soporte) >= startDate
        })
      }

      // Semanal: Last 7 days
      const last7Days = new Date(now)
      last7Days.setDate(now.getDate() - 7)

      // Mensual: Start of Month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      // Anual: Start of Year
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
  }, [historial])

  const processData = (filteredHistorial) => {
    const asuntoStats = {}
    let maxVal = 0

    filteredHistorial.forEach(h => {
      const asunto = h.asunto
      if (asunto) {
        if (!asuntoStats[asunto]) {
          asuntoStats[asunto] = {
            count: 0,
            tecnicos: {}
          }
        }

        asuntoStats[asunto].count += 1

        const tecnicos = h.expand?.tecnicos_asociados || []
        tecnicos.forEach(t => {
          const tName = t.nombre
          if (tName) {
            asuntoStats[asunto].tecnicos[tName] = (asuntoStats[asunto].tecnicos[tName] || 0) + 1
          }
        })

        if (asuntoStats[asunto].count > maxVal) maxVal = asuntoStats[asunto].count
      }
    })

    // Format for Recharts Radar
    // We set fullMark to be slightly higher than max value for better visual
    const fullMark = Math.ceil(maxVal * 1.2) || 10

    return Object.entries(asuntoStats).map(([subject, stats]) => {
      let topTecnico = null
      let topTecnicoCount = 0

      Object.entries(stats.tecnicos).forEach(([tName, tCount]) => {
        if (tCount > topTecnicoCount) {
          topTecnicoCount = tCount
          topTecnico = tName
        }
      })

      return {
        subject: capitalize(subject),
        count: stats.count,
        fullMark,
        topTecnico,
        topTecnicoCount
      }
    })
  }

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-950/90 text-slate-50 p-3 rounded-lg shadow-xl text-xs border border-slate-800 backdrop-blur-sm">
          <p className="font-bold mb-1 text-sm capitalize">{data.subject}</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Soportes:</span>
            <span className="font-bold">{data.count}</span>
          </div>
          {data.topTecnico && (
            <div className="mt-2 pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400 block mb-0.5">Top Técnico:</span>
              <span className="font-medium text-emerald-400">{data.topTecnico}</span>
              <span className="text-xs text-slate-500 ml-1">({data.topTecnicoCount})</span>
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const renderRadarChart = (chartData) => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground font-medium uppercase text-xs sm:text-sm">
          No hay datos para mostrar
        </div>
      )
    }

    return (
      <div className="h-[300px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: 'var(--foreground)', fontSize: 9, fontWeight: 500 }}
              tickFormatter={(val) => val.length > 15 ? `${val.slice(0, 12)}...` : val}
            />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Radar
              name="Soportes"
              dataKey="count"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.5}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg font-bold uppercase tracking-tight">Estadísticas por Asunto</h2>
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="semanal" className="text-xs">SEMANAL</TabsTrigger>
              <TabsTrigger value="mensual" className="text-xs">MENSUAL</TabsTrigger>
              <TabsTrigger value="anual" className="text-xs">ANUAL</TabsTrigger>
              <TabsTrigger value="general" className="text-xs">GENERAL</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="semanal" className="mt-0">
            {renderRadarChart(data.semanal)}
          </TabsContent>
          <TabsContent value="mensual" className="mt-0">
            {renderRadarChart(data.mensual)}
          </TabsContent>
          <TabsContent value="anual" className="mt-0">
            {renderRadarChart(data.anual)}
          </TabsContent>
          <TabsContent value="general" className="mt-0">
            {renderRadarChart(data.general)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default EstadisticasAsuntos

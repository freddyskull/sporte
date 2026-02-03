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
      const semanal = filterByPeriod(historial, now, 7)
      const mensual = filterByPeriod(historial, now, 30)
      const anual = filterByPeriod(historial, now, 365)

      setData({
        semanal: processData(semanal),
        mensual: processData(mensual),
        anual: processData(anual),
        general: processData(historial),
      })
    }
  }, [historial])

  const filterByPeriod = (historial, now, days) => {
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return historial.filter(h => new Date(h.fecha_soporte) >= startDate)
  }

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
        <div className="flex h-[400px] w-full items-center justify-center text-slate-400 font-medium uppercase">
          No hay datos para mostrar
        </div>
      )
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--foreground)', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar
            name="Soportes"
            dataKey="count"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Card>
      <CardContent>
        <div className="w-full mx-auto">
          <Tabs defaultValue="semanal" className="w-full">
            <div className='flex lg:justify-between flex-col lg:flex-row gap-4 items-center'>
              <h2 className="text-sm font-bold uppercase text-foreground text-nowrap">Estadísticas por Asunto</h2>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="semanal">SEMANAL</TabsTrigger>
                <TabsTrigger value="mensual">MENSUAL</TabsTrigger>
                <TabsTrigger value="anual">ANUAL</TabsTrigger>
                <TabsTrigger value="general">GENERAL</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="semanal">
              {renderRadarChart(data.semanal)}
            </TabsContent>
            <TabsContent value="mensual">
              {renderRadarChart(data.mensual)}
            </TabsContent>
            <TabsContent value="anual">
              {renderRadarChart(data.anual)}
            </TabsContent>
            <TabsContent value="general">
              {renderRadarChart(data.general)}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

export default EstadisticasAsuntos

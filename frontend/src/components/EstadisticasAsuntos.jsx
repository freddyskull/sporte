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
    const asuntoCount = {}
    let maxVal = 0

    filteredHistorial.forEach(h => {
      const asunto = h.asunto
      if (asunto) {
        asuntoCount[asunto] = (asuntoCount[asunto] || 0) + 1
        if (asuntoCount[asunto] > maxVal) maxVal = asuntoCount[asunto]
      }
    })

    // Format for Recharts Radar
    // We set fullMark to be slightly higher than max value for better visual
    const fullMark = Math.ceil(maxVal * 1.2) || 10

    return Object.entries(asuntoCount).map(([subject, count]) => ({
      subject: capitalize(subject),
      count,
      fullMark
    }))
  }

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
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
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          />
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

import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useHistorialStore from '../stores/historialStore'
import useTecnicosStore from '../stores/tecnicosStore'
import { Card, CardContent } from '@/components/ui/card'

const COLORS = [
  '#0088FE',
  '#00a152',
  '#b2102f',
  '#FF8042',
  '#8884D8',
  '#8bc34a',
  '#ff9800',
  '#e91e63',
  '#03a9f4',
  '#ffc107',
]

const EstadisticasTecnicos = () => {
  const { historial, fetchHistorial } = useHistorialStore()
  const { tecnicos, fetchTecnicos } = useTecnicosStore()
  const [data, setData] = useState({ semanal: [], mensual: [], anual: [] })

  useEffect(() => {
    fetchHistorial()
    fetchTecnicos()
  }, [fetchHistorial, fetchTecnicos])

  useEffect(() => {
    if (historial.length && tecnicos.length) {
      const now = new Date()
      const semanal = filterByPeriod(historial, now, 7)
      const mensual = filterByPeriod(historial, now, 30)
      const anual = filterByPeriod(historial, now, 365)

      setData({
        semanal: processData(semanal),
        mensual: processData(mensual),
        anual: processData(anual),
      })
    }
  }, [historial, tecnicos])

  const filterByPeriod = (historial, now, days) => {
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return historial.filter(h => new Date(h.created) >= startDate)
  }

  const processData = (filteredHistorial) => {
    const tecnicoCount = {}

    filteredHistorial.forEach(h => {
      const tecnicosAsociados = h.expand?.tecnicos_asociados || []
      tecnicosAsociados.forEach(t => {
        tecnicoCount[t.nombre] = (tecnicoCount[t.nombre] || 0) + 1
      })
    })

    return Object.entries(tecnicoCount).map(([name, value]) => ({ name, value }))
  }

  const renderPieChart = (chartData) => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )

  return (
    <Card >
      <CardContent className="">
        <div className="w-full lg:mx-auto">
          <Tabs defaultValue="semanal" className="">
            <div className='flex lg:justify-between  flex-col lg:flex-row  gap-4 items-center'>
              <h2 className="text-sm font-bold text-nowrap uppercase text-slate-800">Estadísticas de Técnicos</h2>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="semanal">SEMANAL</TabsTrigger>
                <TabsTrigger value="mensual">MENSUAL</TabsTrigger>
                <TabsTrigger value="anual">ANUAL</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="semanal">
              {renderPieChart(data.semanal)}
            </TabsContent>
            <TabsContent value="mensual">
              {renderPieChart(data.mensual)}
            </TabsContent>
            <TabsContent value="anual">
              {renderPieChart(data.anual)}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

export default EstadisticasTecnicos
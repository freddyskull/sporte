import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useHistorialStore from '../stores/historialStore'
import useDepartamentosStore from '../stores/departamentosStore'
import { Card, CardContent } from '@/components/ui/card'

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']

const EstadisticasDepartamentos = () => {
  const { historial, fetchHistorial } = useHistorialStore()
  const { departamentos, fetchDepartamentos } = useDepartamentosStore()
  const [data, setData] = useState({ semanal: [], mensual: [], anual: [] })

  useEffect(() => {
    fetchHistorial()
    fetchDepartamentos()
  }, [fetchHistorial, fetchDepartamentos])

  useEffect(() => {
    if (historial.length && departamentos.length) {
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
  }, [historial, departamentos])

  const filterByPeriod = (historial, now, days) => {
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return historial.filter(h => new Date(h.fecha_soporte) >= startDate)
  }

  const processData = (filteredHistorial) => {
    const departamentoCount = {}

    filteredHistorial.forEach(h => {
      const departamento = h.expand?.departamento?.nombre
      if (departamento) {
        departamentoCount[departamento] = (departamentoCount[departamento] || 0) + 1
      }
    })

    return Object.entries(departamentoCount).map(([name, value]) => ({ name, value }))
  }

  const renderPieChart = (chartData) => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex h-[400px] w-full items-center justify-center text-slate-400 font-medium uppercase">
          No hay datos para mostrar
        </div>
      )
    }

    return (
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
  }

  return (
    <Card>
      <CardContent>
        <div className="w-full mx-auto">
          <Tabs defaultValue="semanal" className="w-full">
            <div className='flex lg:justify-between  flex-col lg:flex-row gap-4 items-center'>
              <h2 className="text-sm font-bold uppercase text-foreground text-nowrap">Estadísticas departamentos</h2>
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

export default EstadisticasDepartamentos
import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useHistorialStore from '../stores/historialStore'
import useDepartamentosStore from '../stores/departamentosStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

const COLORS = [
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF6384',
  '#36A2EB',
  '#FFCE56',
  '#4BC0C0',
  '#9966FF',
  '#FF6384',
]

const EstadisticasDepartamentos = () => {
  const { historial, fetchHistorial } = useHistorialStore()
  const { departamentos, fetchDepartamentos } = useDepartamentosStore()
  const [data, setData] = useState({ semanal: [], mensual: [], anual: [], general: [] })

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
        general: processData(historial),
      })
    }
  }, [historial, departamentos])

  const filterByPeriod = (historial, now, days) => {
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    return historial.filter(h => new Date(h.fecha_soporte) >= startDate)
  }

  const processData = (filteredHistorial) => {
    const departamentoStats = {}

    filteredHistorial.forEach(h => {
      const departamento = h.expand?.departamento?.nombre
      if (departamento) {
        if (!departamentoStats[departamento]) {
          departamentoStats[departamento] = {
            count: 0,
            tecnicos: {}
          }
        }

        departamentoStats[departamento].count += 1

        const tecnicos = h.expand?.tecnicos_asociados || []
        tecnicos.forEach(t => {
          const tName = t.nombre
          if (tName) {
            departamentoStats[departamento].tecnicos[tName] = (departamentoStats[departamento].tecnicos[tName] || 0) + 1
          }
        })
      }
    })

    const result = Object.entries(departamentoStats).map(([name, stats]) => {
      let topTecnico = null
      let topTecnicoCount = 0

      Object.entries(stats.tecnicos).forEach(([tName, tCount]) => {
        if (tCount > topTecnicoCount) {
          topTecnicoCount = tCount
          topTecnico = tName
        }
      })

      return {
        name,
        value: stats.count,
        topTecnico,
        topTecnicoCount
      }
    })

    return result
      .sort((a, b) => b.value - a.value)
      .map((item, index) => ({
        ...item,
        fill: COLORS[index % COLORS.length]
      }))
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-slate-950/90 text-slate-50 p-3 rounded-lg shadow-xl text-xs border border-slate-800 backdrop-blur-sm">
          <p className="font-bold mb-1 text-sm capitalize">{data.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Soportes:</span>
            <span className="font-bold">{data.value}</span>
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

  const renderAreaChart = (chartData) => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex h-[300px] w-full items-center justify-center text-slate-400 font-medium uppercase">
          No hay datos para mostrar
        </div>
      )
    }

    // Calculate total for footer
    const total = chartData.reduce((acc, curr) => acc + curr.value, 0)

    return (
      <div className="w-full">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-lg">Resumen de Departamentos</CardTitle>
            <CardDescription>Distribución de soportes por área</CardDescription>
          </div>
        </CardHeader>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.length > 3 ? value.slice(0, 3) : value}
                interval={0}
                minTickGap={10}
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip cursor={false} content={<CustomTooltip />} />
              <Area
                dataKey="value"
                type="natural"
                fill="url(#fillDesktop)"
                fillOpacity={1}
                stroke="#3b82f6"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <CardFooter className="px-0 pb-0 pt-4 border-t border-white/5 flex-col items-start gap-2">
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Total de {total} soportes registrados <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                Visualizando distribución por departamentos
              </div>
            </div>
          </div>
        </CardFooter>
      </div>
    )
  }

  return (
    <Card>
      <CardContent>
        <div className="w-full mx-auto">
          <Tabs defaultValue="semanal" className="w-full">
            <div className='flex lg:justify-between  flex-col lg:flex-row gap-4 items-center'>
              <h2 className="text-sm font-bold uppercase text-foreground text-nowrap">Estadísticas departamentos</h2>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="semanal">SEMANAL</TabsTrigger>
                <TabsTrigger value="mensual">MENSUAL</TabsTrigger>
                <TabsTrigger value="anual">ANUAL</TabsTrigger>
                <TabsTrigger value="general">GENERAL</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="semanal">
              {renderAreaChart(data.semanal)}
            </TabsContent>
            <TabsContent value="mensual">
              {renderAreaChart(data.mensual)}
            </TabsContent>
            <TabsContent value="anual">
              {renderAreaChart(data.anual)}
            </TabsContent>
            <TabsContent value="general">
              {renderAreaChart(data.general)}
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}

export default EstadisticasDepartamentos
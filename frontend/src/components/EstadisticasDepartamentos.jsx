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
        semanal: { chartData: processData(semanal), totalCount: semanal.length },
        mensual: { chartData: processData(mensual), totalCount: mensual.length },
        anual: { chartData: processData(anual), totalCount: anual.length },
        general: { chartData: processData(historial), totalCount: historial.length },
      })
    }
  }, [historial, departamentos])

  const processData = (filteredHistorial) => {
    const departamentoStats = {}

    filteredHistorial.forEach(h => {
      // Normalize departamentos to always be an array to handle both single and multi-select cases
      let departamentosList = []

      const deptExpand = h.expand?.departamento
      if (deptExpand) {
        if (Array.isArray(deptExpand)) {
          departamentosList = deptExpand
        } else {
          departamentosList = [deptExpand]
        }
      }

      // If no valid expand but maybe an ID is there (though we need name), skip
      if (departamentosList.length === 0) return

      departamentosList.forEach(deptObj => {
        const departamentoName = deptObj.nombre
        if (departamentoName) {
          if (!departamentoStats[departamentoName]) {
            departamentoStats[departamentoName] = {
              count: 0,
              tecnicos: {}
            }
          }

          departamentoStats[departamentoName].count += 1

          const tecnicos = h.expand?.tecnicos_asociados || []
          tecnicos.forEach(t => {
            const tName = t.nombre
            if (tName) {
              departamentoStats[departamentoName].tecnicos[tName] = (departamentoStats[departamentoName].tecnicos[tName] || 0) + 1
            }
          })
        }
      })
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

  const renderAreaChart = ({ chartData, totalCount }) => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex h-[300px] w-full items-center justify-center text-slate-400 font-medium uppercase">
          No hay datos para mostrar
        </div>
      )
    }

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
                Total de {totalCount} soportes registrados <TrendingUp className="h-4 w-4" />
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
    <Card className="h-full">
      <CardContent className="p-6">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-lg font-bold uppercase tracking-tight">Estadísticas Departamentos</h2>
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="semanal" className="text-xs">SEMANAL</TabsTrigger>
              <TabsTrigger value="mensual" className="text-xs">MENSUAL</TabsTrigger>
              <TabsTrigger value="anual" className="text-xs">ANUAL</TabsTrigger>
              <TabsTrigger value="general" className="text-xs">GENERAL</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="semanal" className="mt-0">
            {renderAreaChart(data.semanal || {})}
          </TabsContent>
          <TabsContent value="mensual" className="mt-0">
            {renderAreaChart(data.mensual || {})}
          </TabsContent>
          <TabsContent value="anual" className="mt-0">
            {renderAreaChart(data.anual || {})}
          </TabsContent>
          <TabsContent value="general" className="mt-0">
            {renderAreaChart(data.general || {})}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default EstadisticasDepartamentos
import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useHistorialStore from '../stores/historialStore'
import { Users, Trophy } from 'lucide-react'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-slate-950/90 text-slate-50 p-4 rounded-xl shadow-2xl text-xs border border-slate-800 backdrop-blur-sm relative z-50">
        <p className="font-bold mb-2 text-base capitalize flex items-center gap-2">
          {data.fullName || data.name}
        </p>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Users size={14} /> Total Soportes
            </span>
            <span className="font-bold text-white text-base">{data.soportes}</span>
          </div>

          {data.topTecnico && (
            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-1.5">
                <Trophy size={14} className="text-yellow-500" />
                <span className="uppercase text-[10px] tracking-wider text-slate-400 font-bold">Técnico con más soportes</span>
              </div>
              <div className="flex items-center justify-between gap-4 pl-0.5">
                <span className="font-medium text-blue-400 text-sm truncate max-w-[120px]" title={data.topTecnico}>
                  {data.topTecnico}
                </span>
                <span className="text-slate-400 text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {data.topTecnicoCount} soportes
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

const EstadisticasSoportesMensuales = () => {
  const { historial, fetchHistorial } = useHistorialStore()
  const [data, setData] = useState([])
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
  const [availableYears, setAvailableYears] = useState([])

  useEffect(() => {
    fetchHistorial()
  }, [fetchHistorial])

  useEffect(() => {
    if (historial.length) {
      // Extract unique years from historial
      const years = [...new Set(historial
        .filter(h => h.fecha_soporte)
        .map(h => new Date(h.fecha_soporte).getFullYear())
        .filter(y => !isNaN(y))
      )].sort((a, b) => b - a) // Sort descending

      setAvailableYears(years.map(String))

      // If selected year is not in available years (and we have years), select the most recent one
      if (years.length > 0 && !years.map(String).includes(selectedYear)) {
        setSelectedYear(String(years[0]))
      }

      // Filter by selected year
      const filteredHistorial = historial.filter(h => {
        if (!h.fecha_soporte) return false
        const d = new Date(h.fecha_soporte)
        if (isNaN(d.getTime())) return false
        return d.getFullYear().toString() === selectedYear
      })

      setData(processData(filteredHistorial))
    }
  }, [historial, selectedYear])

  const processData = (historialData) => {
    const monthCounts = {}

    // Formatter for Y-Axis labels (Short Month + Year)
    const dateFormatter = new Intl.DateTimeFormat('es-ES', {
      month: 'short',
      year: 'numeric'
    })

    // Formatter for Tooltip title (Long Month + Year)
    const fullDateFormatter = new Intl.DateTimeFormat('es-ES', {
      month: 'long',
      year: 'numeric'
    })

    historialData.forEach(item => {
      // Must specific valid date
      if (!item.fecha_soporte) return

      const date = new Date(item.fecha_soporte)
      if (isNaN(date.getTime())) return

      // Group by Month: YYYY-MM
      const key = `${date.getFullYear()}-${date.getMonth()}`

      if (!monthCounts[key]) {
        monthCounts[key] = {
          name: dateFormatter.format(date),
          fullName: fullDateFormatter.format(date),
          soportes: 0,
          sortDate: date.getTime(), // Use first date found as sort key
          tecnicoCounts: {}
        }
      }

      monthCounts[key].soportes += 1

      // Count technicians for this support to determine Top Tech later
      const tecnicos = item.expand?.tecnicos_asociados || []
      tecnicos.forEach(t => {
        const tName = t.nombre
        if (tName) {
          monthCounts[key].tecnicoCounts[tName] = (monthCounts[key].tecnicoCounts[tName] || 0) + 1
        }
      })
    })

    // Process Top Tec for each month
    const result = Object.values(monthCounts).map(month => {
      let topTecnico = null
      let topTecnicoCount = 0

      Object.entries(month.tecnicoCounts).forEach(([name, count]) => {
        if (count > topTecnicoCount) {
          topTecnicoCount = count
          topTecnico = name
        }
      })

      return {
        ...month,
        topTecnico,
        topTecnicoCount
      }
    })

    // Sort chronologically
    return result.sort((a, b) => a.sortDate - b.sortDate)
  }

  if ((!data || data.length === 0) && availableYears.length === 0) {
    return null
  }

  // Dynamic height calc
  const dynamicHeight = Math.max(300, data.length * 60)

  return (
    <Card className="col-span-1 md:col-span-2 w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="uppercase text-slate-600 text-md uppercase font-bold">Soportes Mensuales</CardTitle>
        </div>
        {availableYears.length > 0 && (
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div style={{ height: `${dynamicHeight}px` }} className="w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  top: 0,
                  right: 50,
                  left: 10,
                  bottom: 0,
                }}
              >
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={65}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500, textTransform: 'capitalize' }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)', radius: 4 }}
                  allowEscapeViewBox={{ x: true, y: true }}
                />
                <Bar
                  dataKey="soportes"
                  radius={[4, 4, 4, 4]}
                  barSize={24}
                >
                  {
                    data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#3b82f6" />
                    ))
                  }
                  <LabelList
                    dataKey="soportes"
                    position="right"
                    fill="#0f172a"
                    offset={10}
                    fontSize={14}
                    fontWeight="bold"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] w-full items-center justify-center text-slate-400 font-medium uppercase">
            No hay datos para este año
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default EstadisticasSoportesMensuales

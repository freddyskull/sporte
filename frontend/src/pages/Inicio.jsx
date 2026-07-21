import React from 'react'
import { Layout } from '../Layout'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useTecnicosStore from '../stores/tecnicosStore'
import useDepartamentosStore from '../stores/departamentosStore'
import useHistorialStore from '../stores/historialStore'
import EstadisticasTecnicos from '../components/EstadisticasTecnicos'
import EstadisticasDepartamentos from '../components/EstadisticasDepartamentos'
import EstadisticasSoportesMensuales from '../components/EstadisticasSoportesMensuales'
import EstadisticasAsuntos from '../components/EstadisticasAsuntos'
import { Users, Headphones, Building2, Award } from 'lucide-react'

export const Inicio = () => {
  const { tecnicos, loading: loadingTecnicos } = useTecnicosStore()
  const { historial, loading: loadingHistorial, topTecnico, topDepartamento } = useHistorialStore()

  const soportesDelMesCount = React.useMemo(() => {
    if (!historial.length) return 0
    const now = new Date()
    return historial.filter(h => {
      if (!h.fecha_soporte) return false
      const d = new Date(h.fecha_soporte)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  }, [historial])

  const kpis = [
    {
      title: 'Técnicos Registrados',
      value: loadingTecnicos ? 'Cargando...' : `${tecnicos.length}`,
      subtitle: 'Personal disponible',
      icon: Users,
      color: 'from-blue-500/10 to-indigo-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20',
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Soportes del Mes',
      value: loadingHistorial ? 'Cargando...' : `${soportesDelMesCount}`,
      subtitle: 'Mes actual',
      icon: Headphones,
      color: 'from-emerald-500/10 to-teal-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Departamento Más Visitado',
      value: topDepartamento?.nombre || 'N/A',
      subtitle: 'Mayor demanda',
      icon: Building2,
      color: 'from-amber-500/10 to-orange-500/5 text-amber-600 dark:text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Soporte Master',
      value: topTecnico?.nombre || 'N/A',
      subtitle: 'Líder en soportes',
      icon: Award,
      color: 'from-purple-500/10 to-pink-500/5 text-purple-600 dark:text-purple-400 border-purple-500/20',
      iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
    },
  ]

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${kpi.color} border`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
                    <Icon size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate" title={String(kpi.value)}>
                    {kpi.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {kpi.subtitle}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Section 1: Estadísticas de Técnicos & Departamentos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full">
            <EstadisticasTecnicos />
          </div>
          <div className="w-full">
            <EstadisticasDepartamentos />
          </div>
        </div>

        {/* Section 2: Soportes Mensuales & Asuntos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="w-full">
            <EstadisticasSoportesMensuales />
          </div>
          <div className="w-full">
            <EstadisticasAsuntos />
          </div>
        </div>
      </div>
    </Layout>
  )
}


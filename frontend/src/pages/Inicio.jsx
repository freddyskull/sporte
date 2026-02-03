import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useTecnicosStore from '../stores/tecnicosStore'
import useDepartamentosStore from '../stores/departamentosStore'
import useHistorialStore from '../stores/historialStore'
import EstadisticasTecnicos from '../components/EstadisticasTecnicos'
import EstadisticasDepartamentos from '../components/EstadisticasDepartamentos'
import EstadisticasSoportesMensuales from '../components/EstadisticasSoportesMensuales'
import EstadisticasAsuntos from '../components/EstadisticasAsuntos'

export const Inicio = () => {

  const { tecnicos, loading: loadingTecnicos, error: errorTecnicos } = useTecnicosStore()

  const { departamentos, loading: loadingDepartamentos, error: errorDepartamentos } = useDepartamentosStore()

  const { historial, loading: loadingHistorial, error: errorHistorial, topTecnico, topDepartamento } = useHistorialStore()




  return (
    <Layout>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="uppercase text-foreground text-md">Tecnicos registrados</CardTitle>
            <CardDescription className="text-xl text-primary font-bold uppercase">
              {loadingTecnicos ? "cargando..." : tecnicos.length} Tecnicos
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="uppercase text-foreground text-md">Soportes del mes</CardTitle>
            <CardDescription className="text-xl text-primary font-bold uppercase">
              {loadingHistorial ? "cargando..." : historial.filter(h => {
                if (!h.fecha_soporte) return false
                const d = new Date(h.fecha_soporte)
                const now = new Date()
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
              }).length} Soportes
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="uppercase text-foreground text-md">departamentos mas visitado</CardTitle>
            <CardDescription className="text-xl text-primary font-bold uppercase">
              {topDepartamento?.nombre}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="uppercase text-foreground text-md">Soporte Master</CardTitle>
            <CardDescription className="text-xl text-primary font-bold uppercase">
              {topTecnico?.nombre}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-4'>
        <EstadisticasTecnicos />
        <EstadisticasDepartamentos />
      </div>
      <div className='flex md:flex-row flex-col md:gap-4 mt-4 mb-12'>
        <div className='w-full md:w-[45%] min-h-[500px]'>
          <EstadisticasSoportesMensuales />
        </div>
        <div className='w-full md:w-[55%] min-h-[500px]'>
          <EstadisticasAsuntos />
        </div>
      </div>
    </Layout >
  )
}

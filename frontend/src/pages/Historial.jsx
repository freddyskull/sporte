
import React, { useEffect } from 'react'
import { Layout } from '../Layout'
import useHistorialStore from '../stores/historialStore'
import useDepartamentosStore from '../stores/departamentosStore'
import useTecnicosStore from '../stores/tecnicosStore'
import DataTable from '../components/DataTable'
import { Badge } from '@/components/ui/badge'

const columns = [
  {
    accessorKey: 'asunto', header: 'Asunto',
    cell: ({ getValue }) => (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-blue-200 uppercase text-nowrap" title={getValue()}>
        {getValue()}
      </div>
    )
  },
  {
    accessorKey: 'status', header: 'Status',
    cell: ({ getValue }) => (
      <div
        className={
          `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase text-nowrap
        ${getValue() === 'pendiente' && 'bg-yellow-100 text-yellow-800 border-yellow-200'}
        ${getValue() === 'en progreso' && 'bg-green-100 text-green-800 border-green-200'}
        ${getValue() === 'resuelto' && 'bg-blue-100 text-blue-800 border-blue-200'}
        `
        }
        title={getValue()}>
        {getValue()}
      </div>
    )
  },
  {
    accessorKey: 'descripcion_problema', header: 'Descripción',
    cell: ({ getValue }) => (
      <div className="max-w-xs line-clamp-1 text-xs" title={getValue()}>
        {getValue()}
      </div>
    )
  },
  {
    id: 'tecnicos_asociados',
    header: 'Técnicos Asociados',
    cell: ({ row }) => {
      const tecnicos = row.original.expand?.tecnicos_asociados || []
      return tecnicos.length ? (
        <div className="flex flex-wrap gap-1">
          {tecnicos.map((t) => (
            <Badge key={t.id} variant="secondary">
              {t.nombre}
            </Badge>
          ))}
        </div>
      ) : (
        <span className='text-xs'>N/A</span>
      )
    },
  },

  {
    accessorKey: 'created',
    header: 'Fecha',
    cell: ({ getValue }) => {
      // 1. Formateamos la fecha
      const date = new Date(getValue()).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short', // 'short' dará "ene", "feb", etc.
        year: '2-digit',
      })

      // 2. Retornamos el Badge con Tailwind
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-blue-200 uppercase text-nowrap">
          {date}
        </span>
      )
    },
  },
]

const fields = [
  {
    key: 'asunto',
    label: 'Asunto',
    type: 'select',
    options: [
      { value: 'soporte técnico', label: 'Soporte técnico' },
      { value: 'soporte ofimático', label: 'Soporte ofimático' },
      { value: 'falla del saad', label: 'Falla del SAAD' },
      { value: 'falla de conexión', label: 'Falla de conexión' },
      { value: 'falla de internet', label: 'Falla de internet' },
      { value: 'falla de red', label: 'Falla de red' },
      { value: 'mantenimiento correctivo', label: 'Mantenimiento Correctivo' },
      { value: 'mantenimiento preventivo', label: 'Mantenimiento Preventivo' },
      { value: 'cableado estructurado', label: 'Cableado Estructurado' },
      { value: 'soporte de red', label: 'Soporte de red' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'en progreso', label: 'En Progreso' },
      { value: 'resuelto', label: 'Resuelto' },
    ],
  },
  { key: 'descripcion_problema', label: 'Descripción del Problema', type: 'textarea' },
]

export const Historial = () => {
  const { historial, loading, error, fetchHistorial, createHistorial, updateHistorial, deleteHistorial } = useHistorialStore()
  const { departamentos, fetchDepartamentos } = useDepartamentosStore()
  const { tecnicos, fetchTecnicos } = useTecnicosStore()

  useEffect(() => {
    fetchHistorial()
    fetchDepartamentos()
    fetchTecnicos()
  }, [])

  const departamentoOptions = departamentos.map(d => ({ value: d.id, label: d.nombre }))
  const tecnicoOptions = tecnicos.map(t => ({ value: t.id, label: t.nombre }))

  const dynamicFields = [
    ...fields,
    {
      key: 'departamento',
      label: 'Departamento',
      type: 'select',
      options: departamentoOptions,
    },
    {
      key: 'tecnicos_asociados',
      label: 'Técnicos Asociados',
      type: 'multi-select',
      options: tecnicoOptions,
    },
  ]

  if (loading) return <Layout><p>Cargando...</p></Layout>
  if (error) return <Layout><p>Error: {error}</p></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Historial</h1>
      <DataTable
        data={historial}
        columns={columns}
        fields={dynamicFields}
        onCreate={createHistorial}
        onUpdate={updateHistorial}
        onDelete={deleteHistorial}
      />
    </Layout>
  )
}

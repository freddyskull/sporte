import React, { useEffect } from 'react'
import { Layout } from '../Layout'
import useTecnicosStore from '../stores/tecnicosStore'
import DataTable from '../components/DataTable'

const columns = [
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'cedula', header: 'Cédula' },
  { accessorKey: 'cargo', header: 'Cargo' },
]

const fields = [
  { key: 'nombre', label: 'Nombre', type: 'text' },
  { key: 'cedula', label: 'Cédula', type: 'text' },
  {
    key: 'cargo',
    label: 'Cargo',
    type: 'select',
    options: [
      { value: 'programador', label: 'Programador' },
      { value: 'tecnico', label: 'Técnico' },
      { value: 'jefe', label: 'Jefe' },
    ],
  },
]

export const Tecnicos = () => {
  const { tecnicos, loading, error, fetchTecnicos, createTecnico, updateTecnico, deleteTecnico } = useTecnicosStore()

  useEffect(() => {
    fetchTecnicos()
  }, [])

  if (loading) return <Layout><p>Cargando...</p></Layout>
  if (error) return <Layout><p>Error: {error}</p></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4 uppercase text-slate-600">Lista de técnicos</h1>
      <DataTable
        data={tecnicos}
        columns={columns}
        fields={fields}
        onCreate={createTecnico}
        onUpdate={updateTecnico}
        onDelete={deleteTecnico}
      />
    </Layout>
  )
}

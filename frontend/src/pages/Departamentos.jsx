import React, { useEffect, useState } from 'react'
import { Layout } from '../Layout'
import useDepartamentosStore, { pb } from '../stores/departamentosStore'
import DataTable from '../components/DataTable'
import { Dialog, DialogContent } from '@/components/ui/dialog'

const columns = [
  { accessorKey: 'nombre', header: 'Nombre' },
  { accessorKey: 'descripcion', header: 'Descripción' },
  { accessorKey: 'maquinas', header: 'Máquinas' },
  { accessorKey: 'switchs', header: 'Switchs' },
  { accessorKey: 'ubicacions', header: 'Ubicaciones' },
  {
    id: 'ubicacion_img',
    header: 'Imagen',
    cell: ({ row }) => {
      const filename = Array.isArray(row.original.ubicacion_img) ? row.original.ubicacion_img[0] : row.original.ubicacion_img
      const imgUrl = filename ? pb.files.getUrl(row.original, filename) : null
      return imgUrl ? (
        <img
          src={imgUrl}
          alt="Ubicación"
          className="w-16 h-16 object-cover cursor-pointer rounded"
          onClick={() => {
            console.log('Clicked, imgUrl:', imgUrl)
            setFullImage(imgUrl)
          }}
        />
      ) : (
        <span>No imagen</span>
      )
    },
  },
]

const fields = [
  { key: 'nombre', label: 'Nombre', type: 'text' },
  { key: 'descripcion', label: 'Descripción', type: 'text', optional: true },
  { key: 'maquinas', label: 'Máquinas', type: 'number' },
  { key: 'switchs', label: 'Switchs', type: 'number' },
  { key: 'ubicacions', label: 'Ubicaciones', type: 'text' },
  { key: 'ubicacion_img', label: 'Imagen de Ubicación', type: 'file' },
]

export const Departamentos = () => {
  const { departamentos, loading, error, fetchDepartamentos, createDepartamento, updateDepartamento, deleteDepartamento } = useDepartamentosStore()
  const [fullImage, setFullImage] = useState(null)

  useEffect(() => {
    fetchDepartamentos()
  }, [])

  if (loading) return <Layout><p>Cargando...</p></Layout>
  if (error) return <Layout><p>Error: {error}</p></Layout>

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Departamentos</h1>
      <DataTable
        data={departamentos}
        columns={columns}
        fields={fields}
        onCreate={createDepartamento}
        onUpdate={updateDepartamento}
        onDelete={deleteDepartamento}
      />
      <Dialog open={!!fullImage} onOpenChange={() => setFullImage(null)}>
        <DialogContent className="max-w-4xl">
          {fullImage && <img src={fullImage} alt="Imagen completa" className="w-full h-auto" />}
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

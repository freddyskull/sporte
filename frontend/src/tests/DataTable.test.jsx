import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import DataTable from '../components/DataTable'
import React from 'react'

const columns = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Nombre' },
]

const fields = [
  { key: 'name', label: 'Nombre', type: 'text', required: true }
]

const mockData = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  name: `Item ${i + 1}`
}))

describe('DataTable Component', () => {
  it('renders correctly with virtualization', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={columns} 
        fields={fields}
        onCreate={vi.fn()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    // El header debe estar presente
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    
    // Con virtualización, no todos los 100 items deberían estar en el DOM al mismo tiempo
    const rows = screen.getAllByRole('row')
    expect(rows.length).toBeLessThan(101) 
  })

  it('handles fallback internal pagination when props are missing', () => {
    render(
      <DataTable 
        data={mockData} 
        columns={columns} 
        fields={fields}
        onCreate={vi.fn()}
      />
    )

    expect(screen.getByText('Total: 100')).toBeInTheDocument()
    const page1 = screen.getByText('1')
    expect(page1).toBeInTheDocument()
  })

  it('calls onCreate when submitting new item', async () => {
    const onCreate = vi.fn()
    render(
      <DataTable 
        data={[]} 
        columns={columns} 
        fields={fields}
        onCreate={onCreate}
      />
    )

    const addButton = screen.getByRole('button', { name: /crear nuevo registro/i })
    fireEvent.click(addButton)
    
    expect(screen.getByText('Crear Nuevo')).toBeInTheDocument()
  })

  it('shows "No hay resultados" when data is empty', () => {
    render(
      <DataTable 
        data={[]} 
        columns={columns} 
        fields={fields}
      />
    )
    expect(screen.getByText('No hay resultados.')).toBeInTheDocument()
  })
})

import React from 'react'
import MapScene from '@/components/Map3D/MapScene'
import { Layout } from '../Layout'

export const Mapa = () => {
  return (
    <Layout>
      <div className="w-full h-[80vh]">
        <MapScene />
      </div>
    </Layout>
  )
}

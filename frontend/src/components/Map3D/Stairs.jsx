import React from 'react'

export const StairsU = ({ position = "0 0 0", rotation = "0 0 0" }) => {
  return (
    <a-entity id="stairs-u" position={position} rotation={rotation}>
      {/* Descanso (Landing) */}
      <a-box position="0 1.4 -3.0" width="4" height="0.2" depth="1" color="#999999"></a-box>
      <a-box position="0 0.7 -3.0" width="4" height="1.4" depth="1" color="#999999" opacity="0.8"></a-box>

      {/* Tramo 1 (Izquierda - Peldaños subiendo hacia el fondo) */}
      <a-box position="-1 0.125 0.25" width="2" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="-1 0.375 -0.25" width="2" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="-1 0.625 -0.75" width="2" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="-1 0.875 -1.25" width="2" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="-1 1.125 -1.75" width="2" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="-1 1.375 -2.25" width="2" height="0.25" depth="0.5" color="#999999"></a-box>

      {/* Tramo 2 (Derecha - Peldaños subiendo hacia el frente desde el descanso) */}
      <a-box position="0.9 1.625 -2.25" width="1.8" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="0.9 1.875 -1.75" width="1.8" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="0.9 2.125 -1.25" width="1.8" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="0.9 2.375 -0.75" width="1.8" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="0.9 2.625 -0.25" width="1.8" height="0.25" depth="0.5" color="#999999"></a-box>
      <a-box position="0.9 2.775 0.25" width="1.8" height="0.25" depth="0.5" color="#999999"></a-box>
    </a-entity>
  )
}

export const NewStairs = ({ position = "0 0 0", rotation = "0 0 0" }) => {
  return (
    <a-entity id="stairs-new" position={position} rotation={rotation}>
      {/* Descanso (Landing) */}
      <a-box position="-3.5 1.4 0.6" width="1" height="0.2" depth="2" color="#999999"></a-box>
      <a-box position="-3.5 0.7 0.6" width="1" height="1.4" depth="2" color="#999999" opacity="0.8"></a-box>

      {/* Tramo 1 (Frente/Pasillo - Subiendo hacia Izquierda) */}
      <a-box position="-1.5 0.125 0.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>
      <a-box position="-1.75 0.375 0.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>
      <a-box position="-2.0 0.625 0.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>
      <a-box position="-2.25 0.875 0.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>
      <a-box position="-2.5 1.125 0.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>
      <a-box position="-2.75 1.375 0.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>

      {/* Tramo 2 (Fondo/Pared - Subiendo hacia Derecha) */}
      <a-box position="-3.0 1.625 1.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>
      <a-box position="-2.75 1.875 1.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>
      <a-box position="-2.5 2.125 1.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>
      <a-box position="-2.25 2.375 1.1" width="0.25" height="0.25" depth="1" color="#999999"></a-box>
      {[...Array(6)].map((_, i) => (
        <React.Fragment key={i}>
          <a-box position={`${-1.5 - i * 0.25} ${0.125 + i * 0.25} 0.1`} width="0.25" height="0.25" depth="1" color="#999999"></a-box>
          <a-box position={`${-3.0 + i * 0.25} ${1.625 + i * 0.25} 1.1`} width="0.25" height="0.25" depth="1" color="#999999"></a-box>
        </React.Fragment>
      ))}
    </a-entity>
  )
}

export const StairsP2 = ({ position = "0 0 0" }) => {
  return (
    <a-entity id="stairs-p2" position={position}>
      {/* Descanso (Landing) en el fondo (Z=-4.5, Y=0 relativo a P2) */}
      <a-box position="0 0 -4.5" width="4" height="0.2" depth="1" color="#4A6D91"></a-box>

      {/* Tramo 1 (Izquierda) - Subiendo desde P1 Landing (Y=-1.5) hasta P2 (Y=0) */}
      {[
        { y: -1.3125, z: -3.25 }, { y: -1.125, z: -3.5 }, { y: -0.9375, z: -3.75 },
        { y: -0.75, z: -4.0 }, { y: -0.5625, z: -4.25 }, { y: -0.375, z: -4.5 }, { y: -0.1875, z: -4.75 }
      ].map((p, i) => (
        <a-box key={`t1-${i}`} position={`-1 ${p.y} ${p.z}`} width="2" height="0.1875" depth="0.25" color="#4A6D91"></a-box>
      ))}

      {/* Tramo 2 (Derecha) - Subiendo desde P2 (Y=0) hasta P3 (Y=3) */}
      {[
        { y: 0.1875, z: -3.9 }, { y: 0.375, z: -3.74 }, { y: 0.5625, z: -3.58 }, { y: 0.75, z: -3.42 },
        { y: 0.9375, z: -3.26 }, { y: 1.125, z: -3.10 }, { y: 1.3125, z: -2.94 }, { y: 1.5, z: -2.78 },
        { y: 1.6875, z: -2.62 }, { y: 1.875, z: -2.46 }, { y: 2.0625, z: -2.30 }, { y: 2.25, z: -2.14 },
        { y: 2.4375, z: -1.98 }, { y: 2.625, z: -1.82 }, { y: 2.8125, z: -1.66 }
      ].map((p, i) => (
        <a-box key={`t2-${i}`} position={`0.9 ${p.y} ${p.z}`} width="1.8" height="0.1875" depth="0.25" color="#4A6D91"></a-box>
      ))}
    </a-entity>
  )
}

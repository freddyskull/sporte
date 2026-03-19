import React from 'react'
import Department from './Department'
import { StairsU, StairsP2 } from './Stairs'

const Piso2 = () => {
  return (
    <a-entity id="piso-2">
      {/* Suelo General */}
      <a-plane className="suelo-piso" position="20.75 0 0" rotation="-90 0 0" width="48.5" height="10" color="#CCCCCC"></a-plane>
      <a-plane className="suelo-piso" position="40.75 0 9" rotation="-90 0 0" width="8.5" height="8" color="#CCCCCC"></a-plane>

      {/* Líneas divisorias (Z=5 y Z=13) */}
      <a-box position="20.5 0 5" width="48" height="0.15" depth="0.15" color="#333"></a-box>
      <a-box position="40.75 0 13" width="8.5" height="0.15" depth="0.15" color="#333"></a-box>

      {/* NODO Area */}
      <a-entity id="nodo-complex">
        {/* Triggers NODO */}
        <Department id="area-tecnicos-nodo" trigger={{ width: 1.2, height: 2.8, depth: 9, title: 'Área de Técnicos NODO', position: '-2.9 1.6 0.5' }} label={{ text: 'Área de Técnicos NODO', position: '-2.9 2 0', scale: '0.6 0.6 0.6' }} floor={{ width: 0 }} />
        <Department id="baños-nodo" trigger={{ width: 2.3, height: 2.8, depth: 0.75, title: 'Baños del Nodo', position: '-1.15 1.6 -1.875' }} label={{ text: 'Baños del Nodo', position: '-1.15 2 -3.25', scale: '0.5 0.5 0.5' }} floor={{ width: 0 }} />
        <Department id="servidores-nodo" trigger={{ width: 5.8, height: 2.8, depth: 2.75, title: 'Servidores NODO', position: '0.6 1.6 -3.625' }} label={{ text: 'Servidores NODO', position: '2.25 2 -3.625', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="programadores-nodo" trigger={{ width: 2.3, height: 2.8, depth: 5.0, title: 'Programadores NODO', position: '-1.15 1.6 2.5' }} label={{ text: 'Programadores NODO', position: '-1.15 2 2.5', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="recepcion-nodo" trigger={{ width: 2.5, height: 2.8, depth: 2.75, title: 'Recepción NODO', position: '2.25 1.6 -0.875' }} label={{ text: 'Recepción NODO', position: '2.25 2 -0.875', scale: '0.7 0.7 0.7' }} floor={{ width: 0 }} />
        <Department id="oficina-dr-nodo" trigger={{ width: 3.5, height: 2.8, depth: 3, title: 'Oficina Dr. NODO', position: '1.75 1.6 3.5' }} label={{ text: 'Oficina Dr. NODO', position: '1.75 2 3.5', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />

        {/* --- ESTRUCTURA NODO --- */}
        <a-box className="estructura-fija" position="0.6 1.5 -5" width="5.8" height="3" depth="0.1" color="#999999"></a-box>
        <a-box className="estructura-fija" position="-2.9 1.5 -4" width="1.2" height="3" depth="0.1" color="#999999"></a-box>

        <a-box position="-3.4 1.5 -3" width="0.2" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-2.9 2.6 -3" width="0.8" height="0.8" depth="0.1" color="#999999"></a-box>
        <a-box position="-2.4 1.5 -3" width="0.2" height="3" depth="0.1" color="#999999"></a-box>

        <a-box className="estructura-fija" position="-3.5 1.5 0.5" width="0.1" height="3" depth="9" color="#999999"></a-box>
        <a-box position="3.5 1.5 -2.25" width="0.1" height="3" depth="5.5" color="#999999"></a-box>
        <a-box position="3.5 2.6 1.25" width="0.1" height="0.8" depth="1.5" color="#999999"></a-box>
        <a-box position="3.5 1.5 3.5" width="0.1" height="3" depth="3" color="#999999"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="7" height="3" depth="0.1" color="#999999"></a-box>

        <a-box position="0.0 1.5 -1.875" width="0.1" height="3" depth="0.75" color="#999999"></a-box>
        <a-box position="0.0 1.5 2.5" width="0.1" height="3" depth="5.0" color="#999999"></a-box>
        <a-box position="-1.15 1.5 -1.875" width="0.1" height="3" depth="0.75" color="#999999"></a-box>

        <a-box position="2.25 1.5 -2.25" width="2.5" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-1.15 1.5 -2.25" width="2.3" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="0.5 2.6 -2.25" width="1.0" height="0.8" depth="0.1" color="#999999"></a-box>

        <a-box position="2.25 1.5 2.0" width="2.5" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="0.95 1.5 2.0" width="0.1" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="0.5 2.6 2.0" width="0.8" height="0.8" depth="0.1" color="#999999"></a-box>
        <a-box position="0.05 1.5 2.0" width="0.1" height="3" depth="0.1" color="#999999"></a-box>

        {/* Ventana Recepción NODO */}
        <a-box position="2.25 0.75 0.5" width="2.5" height="1.5" depth="0.1" color="#999999"></a-box>
        <a-box position="1.06 2.25 0.5" width="0.12" height="1.5" depth="0.1" color="#999999"></a-box>
        <a-box position="3.44 2.25 0.5" width="0.12" height="1.5" depth="0.1" color="#999999"></a-box>
        <a-box position="2.25 2.375 0.5" width="2.26" height="1.25" depth="0.05" color="#000000" material="opacity: 0.2; transparent: true"></a-box>
        <a-torus position="2.25 1.5 0.5" radius="0.25" radius-tubular="0.02" arc="180" color="#333"></a-torus>

        <a-box position="-1.15 1.5 0.0" width="2.3" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-2.3 1.5 -3.25" width="0.1" height="3" depth="3.5" color="#999999"></a-box>
        <a-box position="-2.3 1.5 2.5" width="0.1" height="3" depth="5.0" color="#999999"></a-box>

        {/* Racks Servidores */}
        <a-entity id="racks-servidores" position="0.6 0 -3.625">
          {[...Array(3)].map((_, i) => (
            <a-entity key={i} position={`${-1.0 + i * 1.0} 0 0`}>
              <a-box position="-0.35 1.5 -0.35" width="0.05" height="3" depth="0.05" color="#E0E0E0"></a-box>
              <a-box position="0.35 1.5 -0.35" width="0.05" height="3" depth="0.05" color="#E0E0E0"></a-box>
              <a-box position="-0.35 1.5 0.35" width="0.05" height="3" depth="0.05" color="#E0E0E0"></a-box>
              <a-box position="0.35 1.5 0.35" width="0.05" height="3" depth="0.05" color="#E0E0E0"></a-box>
              {[0.6, 1.3, 2.0, 2.7].map((h, j) => (
                <React.Fragment key={j}>
                  <a-box position={`0 ${h} 0`} width="0.75" height="0.05" depth="0.75" color="#E0E0E0"></a-box>
                  <a-box position={`0 ${h + 0.15} 0`} width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
                </React.Fragment>
              ))}
            </a-entity>
          ))}
        </a-entity>
      </a-entity>

      {/* Planificación */}
      <Department
        id="planificacion"
        position="14.5 0 0"
        trigger={{
          width: 14, height: 2.8, depth: 10,
          title: 'Planificación',
          description: 'Área de planificación.',
          position: '0 1.6 0'
        }}
        label={{ text: 'Planificación', position: '0 2 0' }}
        floor={{ width: 0 }}
      >
        <a-box className="estructura-fija" position="0 1.5 -5" width="14" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-7 1.5 -2.25" width="0.1" height="3" depth="5.5" color="#999999"></a-box>
        <a-box position="-7 2.6 1.25" width="0.1" height="0.8" depth="1.5" color="#999999"></a-box>
        <a-box position="-7 1.5 3.5" width="0.1" height="3" depth="3" color="#999999"></a-box>
        <a-box position="7 1.5 0" width="0.1" height="3" depth="10" color="#999999"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="14" height="3" depth="0.1" color="#999999"></a-box>
      </Department>

      {/* Laberinto (VR Administrativo / Rectorado) */}
      <a-entity id="laberinto-complex" position="31 0 0">
        {/* Paredes Perimetrales Laberinto */}
        <a-box className="estructura-fija" position="-1.375 1.5 -5" width="8.25" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-5.5 1.5 0" width="0.1" height="3" depth="10" color="#999999"></a-box>
        <a-box position="5.5 1.5 -3.3" width="0.1" height="3" depth="3.4" color="#999999"></a-box>
        <a-box position="5.5 2.45 -1.1" width="0.1" height="1.1" depth="1.0" color="#999999"></a-box>
        <a-box position="5.5 1.5 2.2" width="0.1" height="3" depth="5.6" color="#999999"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="11" height="3" depth="0.1" color="#999999"></a-box>

        {/* Divisiones Internas (Grid Representativo) */}
        <a-box position="-2.75 1.5 -3.125" width="0.1" height="3" depth="3.75" color="#999999"></a-box>
        <a-box position="-2.75 1.5 2.5" width="0.1" height="3" depth="5" color="#999999"></a-box>
        <a-box position="0 1.5 -3.125" width="0.1" height="3" depth="3.75" color="#999999"></a-box>
        <a-box position="0 2.6 0.5" width="0.1" height="0.8" depth="0.8" color="#999999"></a-box>
        <a-box position="0 1.5 3.0" width="0.1" height="3" depth="4" color="#999999"></a-box>
        <a-box position="2.75 1.5 -3.0625" width="0.1" height="3" depth="3.875" color="#999999"></a-box>
        <a-box position="2.75 2.6 -0.625" width="0.1" height="0.8" depth="1.0" color="#999999"></a-box>
        <a-box position="2.75 1.5 2.4375" width="0.1" height="3" depth="5.125" color="#999999"></a-box>

        {/* Horizontales */}
        <a-box position="-4.8125 1.5 -2.5" width="1.375" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="0 1.5 -2.5" width="5.5" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="4.125 1.5 -3.5" width="2.75" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-1.375 1.5 -1.25" width="2.75" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="1.375 1.5 -1.25" width="2.75" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="1.375 1.5 0" width="2.75" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="4.125 1.5 1.0" width="2.75" height="3" depth="0.1" color="#999999"></a-box>

        {/* Triggers destacados del Laberinto */}
        <Department id="prodinpa" trigger={{ width: 2.6, height: 3, depth: 2.4, title: 'PRODINPA', position: '-4.125 1.5 -3.75' }} label={{ text: 'PRODINPA', position: '-4.125 2 -3.75', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="curriculum" trigger={{ width: 1.3, height: 3, depth: 2.4, title: 'Curriculum', position: '-4.775 1.5 -1.25' }} label={{ text: 'Curriculum', position: '-4.775 2 -1.25', scale: '0.5 0.5 0.5' }} floor={{ width: 0 }} />
        <Department id="oficina-5" trigger={{ width: 2.6, height: 3, depth: 4.9, title: 'Oficina 5', position: '-1.375 1.5 2.5' }} label={{ text: 'Oficina 5', position: '-1.375 2 2.5' }} floor={{ width: 0 }} />
        <Department id="oficina-4" trigger={{ width: 2.6, height: 3, depth: 4.9, title: 'Oficina 4', position: '1.375 1.5 2.5' }} label={{ text: 'Oficina 4', position: '1.375 2 2.5' }} floor={{ width: 0 }} />
      </a-entity>

      {/* V.R. Académico */}
      <a-entity id="vr-academico-complex" position="40.5 0 0">
        <Department id="vr-academico" trigger={{ width: 6.375, height: 3, depth: 4.4, title: 'V.R. Académico', position: '-0.8125 1.5 -2.8' }} label={{ text: 'V.R. Académico', position: '-0.81 2 -2.8', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="oficina-vra" trigger={{ width: 2.125, height: 3, depth: 4.4, title: 'Oficina del V.R. Académico', position: '3.4375 1.5 -2.8' }} label={{ text: 'Oficina\nV.R.A.', position: '3.44 2 -2.8', scale: '0.7 0.7 0.7' }} floor={{ width: 0 }} />
        <Department id="despacho" trigger={{ width: 8.5, height: 3, depth: 11.4, title: 'Despacho', position: '0.25 1.5 7.3' }} label={{ text: 'Despacho', position: '0 2 3.3' }} floor={{ width: 0 }} />

        <a-box className="estructura-fija" position="0.25 1.5 -5" width="8.5" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-4 1.5 -3.3" width="0.1" height="3" depth="3.4" color="#999999"></a-box>
        <a-box position="-4 2.45 -1.1" width="0.1" height="1.1" depth="1.0" color="#999999"></a-box>
        <a-box position="-4 1.5 2.2" width="0.1" height="3" depth="5.6" color="#999999"></a-box>
        <a-box position="-4 1.5 9" width="0.1" height="3" depth="8" color="#999999"></a-box>
        <a-box position="4.5 1.5 -2.8" width="0.1" height="3" depth="4.4" color="#999999"></a-box>
        <a-box position="4 1.5 0.5" width="0.1" height="3" depth="2.2" color="#999999"></a-box>
        <a-box position="4.5 1.5 7.3" width="0.1" height="3" depth="11.4" color="#999999"></a-box>
        <a-box className="pared-frontal" position="0.25 1.5 13" width="8.5" height="3" depth="0.1" color="#999999"></a-box>

        <a-box position="-1.6 1.5 -0.6" width="4.8" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="1.3 2.6 -0.6" width="1" height="0.8" depth="0.1" color="#999999"></a-box>
        <a-box position="3.15 1.5 -0.6" width="2.7" height="3" depth="0.1" color="#999999"></a-box>

        <a-box position="0.25 1.5 -4.7" width="0.1" height="3" depth="0.6" color="#999999"></a-box>
        <a-box position="0.25 2.6 -3.9" width="0.1" height="0.8" depth="1.0" color="#999999"></a-box>
        <a-box position="0.25 1.5 -3.1" width="0.1" height="3" depth="0.6" color="#999999"></a-box>
        <a-box position="-1.875 1.5 -2.8" width="4.25" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="2.375 1.5 -4.25" width="0.1" height="3" depth="1.5" color="#999999"></a-box>
        <a-box position="2.375 2.6 -3.0" width="0.1" height="0.8" depth="1.0" color="#999999"></a-box>
        <a-box position="2.375 1.5 -1.55" width="0.1" height="3" depth="1.9" color="#999999"></a-box>
      </a-entity>

      {/* Escaleras */}
      <a-entity id="pasillo-stairs-1" position="5.5 0 0">
        <StairsP2 />
      </a-entity>
      <a-entity id="pasillo-stairs-2" position="23.5 0 0">
        <StairsU />
      </a-entity>
    </a-entity>
  )
}

export default Piso2

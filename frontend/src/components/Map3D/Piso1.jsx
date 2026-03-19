import React from 'react'
import Department from './Department'
import { StairsU } from './Stairs'

const Piso1 = () => {
  return (
    <a-entity id="piso-1">
      {/* Suelo General */}
      <a-plane className="suelo-piso" position="20.75 0 0" rotation="-90 0 0" width="48.5" height="10" color="#CCCCCC"></a-plane>
      <a-plane className="suelo-piso" position="40.75 0 9" rotation="-90 0 0" width="8.5" height="8" color="#CCCCCC"></a-plane>

      {/* Líneas divisorias (Z=5 y Z=13) */}
      <a-box position="20.5 0 5" width="48" height="0.15" depth="0.15" color="#333"></a-box>
      <a-box position="40.75 0 13" width="8.5" height="0.15" depth="0.15" color="#333"></a-box>

      {/* Control De Estudios */}
      <Department
        id="control-de-estudios"
        position="0 0 0"
        trigger={{
          width: 7, height: 2.8, depth: 10,
          title: 'Control De Estudios',
          description: 'Oficina de control de estudios.',
          position: '0 1.6 0'
        }}
        label={{ text: 'Control De Estudios', position: '0 2 0' }}
        floor={{ width: 0 }}
      >
        <a-box className="estructura-fija" position="0 1.5 -5" width="7" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box className="estructura-fija" position="-3.5 1.5 0" width="0.1" height="3" depth="10" color="#4A6D91"></a-box>
        <a-box position="3.5 1.5 -2.25" width="0.1" height="3" depth="5.5" color="#4A6D91"></a-box>
        <a-box position="3.5 2.6 1.25" width="0.1" height="0.8" depth="1.5" color="#4A6D91"></a-box>
        <a-box position="3.5 1.5 3.5" width="0.1" height="3" depth="3" color="#4A6D91"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="7" height="3" depth="0.1" color="#4A6D91"></a-box>
      </Department>

      {/* Pasillo 1 con Escaleras */}
      <a-entity id="pasillo-stairs-1" position="5.5 0 0">
        <StairsU />
      </a-entity>

      {/* Servicios Generales Complex (Habitación 2 y 3 original) */}
      <a-entity id="servicios-generales-complex" position="14.5 0 0">
        {/* Paredes Perimetrales */}
        <a-box className="estructura-fija" position="0 1.5 -5" width="14" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-7 1.5 -2.25" width="0.1" height="3" depth="5.5" color="#4A6D91"></a-box>
        <a-box position="-7 2.6 1.25" width="0.1" height="0.8" depth="1.5" color="#4A6D91"></a-box>
        <a-box position="-7 1.5 3.5" width="0.1" height="3" depth="3" color="#4A6D91"></a-box>
        <a-box position="7 1.5 0" width="0.1" height="3" depth="10" color="#4A6D91"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="14" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Oficinas y Triggers */}
        <Department
          id="sg-izq-fondo"
          trigger={{ width: 1.75, height: 3, depth: 2, title: 'Servicios Generales', position: '-6.125 1.5 -4.0' }}
          label={{ text: 'Servicios\nGenerales', position: '-6.125 2 -4.0', scale: '0.6 0.6 0.6' }}
          floor={{ width: 0 }}
        />
        <Department
          id="sg-anexo-fondo"
          trigger={{ width: 1.75, height: 3, depth: 1, title: 'Servicios Generales', position: '-4.375 1.5 -4.5' }}
          floor={{ width: 0 }}
        />
        <Department
          id="sg-centro"
          trigger={{ width: 3.5, height: 3, depth: 3.5, title: 'Servicios Generales', position: '-5.25 1.5 -1.25' }}
          label={{ text: 'Servicios\nGenerales', position: '-5.25 2 -1.25', scale: '0.8 0.8 0.8' }}
          floor={{ width: 0 }}
        />
        <Department
          id="sg-oficina-1"
          trigger={{ width: 3.5, height: 3, depth: 4.5, title: 'Oficina 1', position: '-1.75 1.5 -2.75' }}
          label={{ text: 'Oficina 1', position: '-1.75 2 -2.75' }}
          floor={{ width: 0 }}
        />
        <Department
          id="sg-oficina-2"
          trigger={{ width: 3.5, height: 3, depth: 4.5, title: 'Oficina 2', position: '1.75 1.5 -2.75' }}
          label={{ text: 'Oficina 2', position: '1.75 2 -2.75' }}
          floor={{ width: 0 }}
        />
        {/* Técnicos Impresoras y Registro de Bienes */}
        <a-entity id="tecnicos-registro">
          <Department
            id="sg-tecnicos-impresoras"
            trigger={{ width: 2, height: 3, depth: 1, title: 'Técnicos de Impresoras', position: '4.5 1.5 -4.5' }}
            label={{ text: 'Técnicos\nImpresoras', position: '4.5 2 -4.5', scale: '0.5 0.5 0.5' }}
            floor={{ width: 0 }}
          />
          <Department
            id="sg-registro-bienes"
            trigger={{ width: 3.5, height: 3, depth: 2.5, title: 'Registro de bienes', position: '5.25 1.5 -2.75' }}
            label={{ text: 'Registro de\nbienes', position: '5.25 2 -3.25', scale: '0.7 0.7 0.7' }}
            floor={{ width: 0 }}
          />
        </a-entity>

        {/* Parte Frontal: Compras, Seguridad, Mantenimiento */}
        <Department
          id="sg-compras"
          trigger={{ width: 3.5, height: 3, depth: 4.5, title: 'Compras', position: '-1.75 1.5 2.75' }}
          label={{ text: 'Compras', position: '-1.75 2 2.75' }}
          floor={{ width: 0 }}
        />
        <Department
          id="sg-mantenimiento"
          trigger={{ width: 1.75, height: 3, depth: 4.5, title: 'Dir. De Mantenimiento', position: 0.875, scale: '0.6 0.6 0.6' }}
          label={{ text: 'Dir. De\nMantenimiento', position: '0.875 2 2.75', scale: '0.6 0.6 0.6' }}
          floor={{ width: 0 }}
        />
        <Department
          id="sg-oficina-3"
          trigger={{ width: 1.75, height: 3, depth: 3, title: 'Oficina 3', position: '2.625 1.5 3.5' }}
          label={{ text: 'Oficina 3', position: '2.625 2 3.5', scale: '0.8 0.8 0.8' }}
          floor={{ width: 0 }}
        />
        <Department
          id="sg-seguridad"
          trigger={{ width: 3.5, height: 3, depth: 2.25, title: 'Seguridad', position: '-5.25 1.5 3.875' }}
          label={{ text: 'Seguridad', position: '-5.25 2 3.875' }}
          floor={{ width: 0 }}
        />
        <Department
          id="sg-bienes-servicios"
          trigger={{ width: 3.5, height: 3, depth: 4, title: 'Bienes y servicios', position: '5.25 1.5 3.0' }}
          label={{ text: 'Bienes y\nservicios', position: '5.25 2 2.75' }}
          floor={{ width: 0 }}
        />

        {/* Paredes Internas Divisorias */}
        <a-box position="0 1.5 -2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="0 1.5 2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="-3.5 1.5 -2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="-3.5 1.5 2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="3.5 1.5 -2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="3.5 1.5 2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>

        {/* Pasillo Horizontal (Dinteles y Puertas) */}
        <a-box position="-2.875 1.5 -0.5" width="1.25" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-1.75 2.6 -0.5" width="1" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-0.625 1.5 -0.5" width="1.25" height="3" depth="0.1" color="#4A6D91"></a-box>

        <a-box position="0.625 1.5 -0.5" width="1.25" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="1.75 2.6 -0.5" width="1" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="2.875 1.5 -0.5" width="1.25" height="3" depth="0.1" color="#4A6D91"></a-box>

        <a-box position="-2.875 1.5 0.5" width="1.25" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-1.75 2.6 0.5" width="1" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-0.625 1.5 0.5" width="1.25" height="3" depth="0.1" color="#4A6D91"></a-box>

        <a-box position="0.875 1.5 0.5" width="1.75" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="3.125 1.5 0.5" width="0.75" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Paredes Oficina 3 y Mantenimiento */}
        <a-box position="1.75 1.5 0.8" width="0.1" height="3" depth="0.6" color="#4A6D91"></a-box>
        <a-box position="1.75 2.6 1.5" width="0.1" height="0.8" depth="0.8" color="#4A6D91"></a-box>
        <a-box position="1.75 1.5 3.45" width="0.1" height="3" depth="3.1" color="#4A6D91"></a-box>
        <a-box position="2.75 1.5 1.25" width="0.1" height="3" depth="1.5" color="#4A6D91"></a-box>
        <a-box position="2.25 2.6 2.0" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
      </a-entity>

      {/* Pasillo 2 con Escaleras */}
      <a-entity id="pasillo-stairs-2" position="23.5 0 0">
        <StairsU />
      </a-entity>

      {/* Asesoría Jurídica */}
      <Department
        id="asesoria-juridica"
        position="31 0 0"
        trigger={{
          width: 11, height: 2.8, depth: 10,
          title: 'Asesoría Jurídica',
          description: 'Área de asesoría jurídica.',
          position: '0 1.6 0'
        }}
        label={{ text: 'Asesoría Jurídica', position: '0 2 0' }}
        floor={{ width: 0 }}
      >
        <a-box className="estructura-fija" position="0 1.5 -5" width="11" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-5.5 1.5 -2.25" width="0.1" height="3" depth="5.5" color="#4A6D91"></a-box>
        <a-box position="-5.5 2.6 1.25" width="0.1" height="0.8" depth="1.5" color="#4A6D91"></a-box>
        <a-box position="-5.5 1.5 3.5" width="0.1" height="3" depth="3" color="#4A6D91"></a-box>
        <a-box position="5.5 1.5 0" width="0.1" height="3" depth="10" color="#4A6D91"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="11" height="3" depth="0.1" color="#4A6D91"></a-box>
      </Department>

      {/* Consejo Universitario / Secretaría */}
      <a-entity id="consejo-secretaria-complex" position="40.5 0 0">
        <Department
          id="consejo-universitario"
          trigger={{
            width: 8.5, height: 3, depth: 4.4,
            title: 'Consejo Universitario',
            description: 'Sala del Consejo Universitario.',
            position: '0.25 1.5 -2.8'
          }}
          label={{ text: 'Consejo Universitario', position: '0 2 -2.8' }}
          floor={{ width: 0 }}
        />
        <Department
          id="secretaria"
          trigger={{
            width: 8.5, height: 3, depth: 11.4,
            title: 'Secretaría',
            description: 'Secretaría del Consejo Universitario.',
            position: '0.25 1.5 7.3'
          }}
          label={{ text: 'Secretaría', position: '0 2 3.3' }}
          floor={{ width: 0 }}
        />

        {/* Paredes Perimetrales */}
        <a-box className="estructura-fija" position="0.25 1.5 -5" width="8.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-4 1.5 0" width="0.1" height="3" depth="10" color="#4A6D91"></a-box>
        <a-box position="-4 1.5 9" width="0.1" height="3" depth="8" color="#4A6D91"></a-box>
        <a-box position="4.5 1.5 -2.8" width="0.1" height="3" depth="4.4" color="#4A6D91"></a-box>
        <a-box position="4.5 1.5 7.3" width="0.1" height="3" depth="11.4" color="#4A6D91"></a-box>
        <a-box className="pared-frontal" position="0.25 1.5 13" width="8.5" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Divisiones Internas */}
        <a-box position="-1.6 1.5 -0.6" width="4.8" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="1.3 2.6 -0.6" width="1" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="3.15 1.5 -0.6" width="2.7" height="3" depth="0.1" color="#4A6D91"></a-box>

        <a-box position="-1.6 1.5 1.6" width="4.8" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="1.3 2.6 1.6" width="1" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="3.15 1.5 1.6" width="2.7" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Escaleras Internas */}
        <a-entity id="escaleras-internas-p1" position="0 0 0">
          <a-box position="-3.5 1.4 0.6" width="1" height="0.2" depth="2" color="#999999"></a-box>
          <a-box position="-3.5 0.7 0.6" width="1" height="1.4" depth="2" color="#999999"></a-box>
          {/* Peldaños simplificados para mantener rendimiento */}
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <a-box position={`${-1.5 - i * 0.25} ${0.125 + i * 0.25} 0.1`} width="0.25" height="0.25" depth="1" color="#999999"></a-box>
              <a-box position={`${-3.0 + i * 0.25} ${1.625 + i * 0.25} 1.1`} width="0.25" height="0.25" depth="1" color="#999999"></a-box>
            </React.Fragment>
          ))}
        </a-entity>
      </a-entity>
    </a-entity>
  )
}

export default Piso1

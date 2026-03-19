import React from 'react'
import Department from './Department'

const Piso3 = () => {
  return (
    <a-entity id="piso-3">
      {/* Suelo General */}
      <a-plane className="suelo-piso" position="16.5 0 0" rotation="-90 0 0" width="40" height="10" color="#CCCCCC"></a-plane>

      {/* Línea divisoria frontal */}
      <a-box position="16.5 0 5" width="40" height="0.15" depth="0.15" color="#333"></a-box>

      {/* AREA 1: Finanzas / Administración / Nómina / Presupuesto */}
      <a-entity id="area1-p3" position="2 0 0">
        {/* Clickables Area 1 */}
        <Department id="finanzas-p3" trigger={{ width: 3.125, height: 3, depth: 5, title: 'Finanzas', position: '-3.9375 1.5 -2.5' }} label={{ text: 'Finanzas', position: '-3.9375 2 -2.5', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="baño-p3" trigger={{ width: 1.375, height: 3, depth: 2.5, title: 'Baño', position: '-1.6875 1.5 -1.75' }} label={{ text: 'Baño', position: '-1.6875 2 -1.75', scale: '0.6 0.6 0.6' }} floor={{ width: 0 }} />
        <Department id="administracion-p3" trigger={{ width: 5.5, height: 3, depth: 4.5, title: 'Administración', position: '-2.75 1.5 2.75' }} label={{ text: 'Administración', position: '-2.75 2 2.75', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="presupuesto-p3" trigger={{ width: 3.5, height: 3, depth: 4.5, title: 'Presupuesto', position: '1.75 1.5 -2.75' }} label={{ text: 'Presupuesto', position: '1.75 2 -2.75', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="nomina-p3-anexo" trigger={{ width: 5.5, height: 3, depth: 4.5, title: 'Nómina', position: '2.75 1.5 2.75' }} label={{ text: 'Nómina', position: '2.75 2 2.75', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />

        {/* Walls Area 1 */}
        <a-box className="estructura-fija" position="-1 1.5 -5" width="9" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="4.5 2.6 -1.5" width="2" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box className="estructura-fija" position="-5.5 1.5 0" width="0.1" height="3" depth="10" color="#4A6D91"></a-box>
        <a-box position="5.5 1.5 -2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="11" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Pasillo y Divisiones Internas */}
        <a-box position="1.25 1.5 -0.5" width="2.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="3.0 2.6 -0.5" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="2.75 1.5 0.5" width="5.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-1.375 1.5 0.5" width="2.75" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-3.25 2.6 0.5" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-4.625 1.5 0.5" width="1.75" height="3" depth="0.1" color="#4A6D91"></a-box>

        <a-box position="0 1.5 -2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="3.5 1.5 -2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="0 1.5 2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="-2.375 1.5 -2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="-1.0 1.5 -1.75" width="0.1" height="3" depth="2.5" color="#4A6D91"></a-box>

        {/* Puerta Finanzas */}
        <a-box position="-2.28 1.5 -3.0" width="0.19" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-1.6875 2.6 -3.0" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-1.09 1.5 -3.0" width="0.19" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-2.375 1.5 -0.5" width="2.75" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Division Administración */}
        <a-box position="-2.75 2.6 1.0" width="0.1" height="0.8" depth="1.0" color="#4A6D91"></a-box>
        <a-box position="-2.75 1.5 3.25" width="0.1" height="3" depth="3.5" color="#4A6D91"></a-box>

        {/* Switches Area 1 */}
        <a-entity id="switches-area1">
          <a-entity id="switch-admin-p3" position="-3.25 1.5 2.75" rotation="0 0 90">
            <a-box width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
          </a-entity>
          <a-entity id="switch-nomina-p3" position="4.75 1.5 2.75" rotation="0 0 90">
            <a-box width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
          </a-entity>
          <a-entity id="switch-finanzas-p3" position="-5.1 1.5 -2.5" rotation="0 90 0">
            <a-box width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
          </a-entity>
          <a-entity id="switch-presupuesto-p3" position="1.75 1.5 -2.75" rotation="-90 0 0">
            <a-box width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
          </a-entity>
        </a-entity>
      </a-entity>

      {/* AREA 2: Reclutamiento / RRHH / Nómina */}
      <a-entity id="area2-p3" position="11 0 0">
        <Department id="reclutamiento-p3" trigger={{ width: 4.5, height: 3, depth: 4.5, title: 'Reclutamiento y Selección', position: '-0.125 1.5 -3.375' }} label={{ text: 'Reclutamiento y\nSelección', position: '-1.5 2 -3', scale: '0.66 0.66 0.66' }} floor={{ width: 0 }} />
        <Department id="rrhh-p3" trigger={{ width: 3, height: 3, depth: 4.5, title: 'RRHH', position: '2 1.5 -2.75' }} label={{ text: 'RRHH', position: '2.5 2 -3', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="nomina-p3-main" trigger={{ width: 7, height: 3, depth: 4.5, title: 'Nómina', position: '0 1.5 2.75' }} label={{ text: 'Nómina', position: '0 2 3.5', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />

        {/* Walls Area 2 */}
        <a-box className="estructura-fija" position="0 1.5 -5" width="7" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-3.5 1.5 -2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="3.5 1.5 -1.75" width="0.1" height="3" depth="6.5" color="#4A6D91"></a-box>
        <a-box position="3.5 1.5 3.75" width="0.1" height="3" depth="2.5" color="#4A6D91"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="7" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Divisiones Internas Pasillo Laberíntico Area 2 */}
        <a-box position="0.5 1.5 -1.0" width="0.1" height="3" depth="1.0" color="#4A6D91"></a-box>
        <a-box position="0.5 2.6 -2.0" width="0.1" height="0.8" depth="1.0" color="#4A6D91"></a-box>
        <a-box position="0.5 1.5 -2.75" width="0.1" height="3" depth="0.5" color="#4A6D91"></a-box>
        <a-box position="1.25 1.5 -3" width="1.6" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="2.0 1.5 -4" width="0.1" height="3" depth="2" color="#4A6D91"></a-box>

        {/* Pasillo central zig-zag */}
        <a-box position="-2.0 1.5 -0.5" width="3.0" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="0 2.6 -0.5" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="0.5 1.5 0.5" width="0.1" height="3" depth="2.0" color="#4A6D91"></a-box>
        <a-box position="2.0 1.5 1.5" width="3.0" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-2.0 1.5 0.5" width="3.0" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-0.5 1.5 1.5" width="0.1" height="3" depth="2.0" color="#4A6D91"></a-box>
        <a-box position="0 2.6 2.5" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="2.0 1.5 2.5" width="3.0" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Switch Reclutamiento */}
        <a-entity id="switch-reclutamiento-p3" position="-3.02 1.5 -2.75" rotation="0 0 90">
          <a-box width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
        </a-entity>
      </a-entity>

      {/* AREA 3: Contabilidad */}
      <a-entity id="area3-p3" position="18 0 0">
        <Department id="contabilidad-p3" trigger={{ width: 7, height: 3, depth: 10, title: 'Contabilidad', position: '0 1.5 0' }} label={{ text: 'Contabilidad', position: '0 2 0', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />

        <a-box className="estructura-fija" position="0 1.5 -5" width="7" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-3.5 1.5 -1.75" width="0.1" height="3" depth="6.5" color="#4A6D91"></a-box>
        <a-box position="-3.5 1.5 3.75" width="0.1" height="3" depth="2.5" color="#4A6D91"></a-box>
        <a-box position="3.5 1.5 -0.75" width="0.1" height="3" depth="8.5" color="#4A6D91"></a-box>
        <a-box position="3.5 1.5 4.75" width="0.1" height="3" depth="0.5" color="#4A6D91"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="7" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Pasillo interno Contabilidad */}
        <a-box position="-2.75 1.5 1.5" width="1.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-1.5 2.6 1.5" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-0.75 1.5 1.5" width="0.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-2.5 1.5 2.5" width="2.0" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-0.5 1.5 2.5" width="0.1" height="3" depth="2.0" color="#4A6D91"></a-box>
        <a-box position="-1.5 1.5 3.5" width="0.1" height="3" depth="2.0" color="#4A6D91"></a-box>
        <a-box position="1.5 1.5 3.5" width="4.0" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="1.0 1.5 4.5" width="5.0" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Switch Contabilidad */}
        <a-entity id="switch-contabilidad-p3" position="3.2 1.5 1.2" rotation="-90 0 0">
          <a-box width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
        </a-entity>
      </a-entity>

      {/* Pasillo / Escaleras Area - Mantener hueco central */}
      <a-entity id="pasillo-stairs-p3" position="23.5 0 0">
        <a-box position="0 1.5 -5" width="4" height="3" depth="0.1" color="#4A6D91"></a-box>
      </a-entity>

      {/* AREA 4: Vicerrectorado Administrativo Complex */}
      <a-entity id="area4-p3" position="31 0 0">
        <Department id="oficina-vra-p3" trigger={{ width: 6.0, height: 3, depth: 4, title: 'Oficina del V.R. Administrativo', position: '-2.5 1.5 -3.0' }} label={{ text: 'Oficina V.R.\nAdministrativo', position: '-3.25 2 -3.0', scale: '0.6 0.6 0.6' }} floor={{ width: 0 }} />
        <Department id="vr-administrativo-p3" trigger={{ width: 6, height: 3, depth: 7.5, title: 'V.R. Administrativo', position: '-2.5 1.5 1.25' }} label={{ text: 'V.R. Administrativo', position: '0 2 0', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="adiestramiento-p3" trigger={{ width: 5, height: 3, depth: 4.5, title: 'Adiestramiento', position: '3.0 1.5 2.75' }} label={{ text: 'Adiestramiento', position: '3 2 2.75', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="por-asignar-p3" trigger={{ width: 2.5, height: 3, depth: 4, title: 'Por Asignar', position: '1.75 1.5 -3.0' }} label={{ text: 'Por Asignar', position: '1.75 2 -3.0', scale: '0.6 0.6 0.6' }} floor={{ width: 0 }} />
        <Department id="higiene-seguridad-p3" trigger={{ width: 2.5, height: 3, depth: 4, title: 'Higiene y Seguridad', position: '4.25 1.5 -3.0' }} label={{ text: 'Higiene y\nSeguridad', position: '4.25 2 -3.0', scale: '0.6 0.6 0.6' }} floor={{ width: 0 }} />

        {/* Walls Area 4 */}
        <a-box className="estructura-fija" position="0 1.5 -5" width="11" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-5.5 1.5 -1.5" width="0.1" height="3" depth="7.0" color="#4A6D91"></a-box>
        <a-box position="-5.5 2.6 2.75" width="0.1" height="0.8" depth="1.5" color="#4A6D91"></a-box>
        <a-box position="-5.5 1.5 4.25" width="0.1" height="3" depth="1.5" color="#4A6D91"></a-box>
        <a-box position="5.5 1.5 0" width="0.1" height="3" depth="10" color="#4A6D91"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="11" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Divisiones VRA */}
        <a-box position="-3.25 1.5 2.0" width="4.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-1.0 1.5 1.5" width="0.1" height="3" depth="1.0" color="#4A6D91"></a-box>
        <a-box position="-1.0 2.6 0.5" width="0.1" height="0.8" depth="1.0" color="#4A6D91"></a-box>
        <a-box position="-1.0 1.5 -0.5" width="0.1" height="3" depth="1.0" color="#4A6D91"></a-box>
        <a-box position="-4.75 1.5 -1.0" width="1.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-3.25 2.6 -1.0" width="1.5" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="-1.75 1.5 -1.0" width="1.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="0.5 1.5 -3.0" width="0.1" height="3" depth="4.0" color="#4A6D91"></a-box>
        <a-box position="3.0 1.5 -3.0" width="0.1" height="3" depth="4.0" color="#4A6D91"></a-box>

        {/* Pasillo a sectores VRA */}
        <a-box position="-0.25 1.5 -1.0" width="1.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="0.75 1.5 -1.0" width="0.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="1.5 2.6 -1.0" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="2.75 1.5 -1.0" width="1.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="4.0 2.6 -1.0" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="5.0 1.5 -1.0" width="1.0" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="0.5 1.5 2.75" width="0.1" height="3" depth="4.5" color="#4A6D91"></a-box>
        <a-box position="0.75 1.5 0.5" width="0.5" height="3" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="1.5 2.6 0.5" width="1.0" height="0.8" depth="0.1" color="#4A6D91"></a-box>
        <a-box position="3.75 1.5 0.5" width="3.5" height="3" depth="0.1" color="#4A6D91"></a-box>

        {/* Switches Area 4 */}
        <a-entity id="switch-adiestramiento-p3" position="5.2 1.5 0.8" rotation="0 -90 0">
          <a-box width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
        </a-entity>
        <a-entity id="switch-higiene-p3" position="5.2 1.5 -3.0" rotation="0 -90 0">
          <a-box width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
        </a-entity>
        <a-entity id="switch-vra-p3" position="-2.5 1.5 -4.7" rotation="0 90 90">
          <a-box width="0.5" height="0.15" depth="0.3" color="#4FC3F7"></a-box>
        </a-entity>
      </a-entity>
    </a-entity>
  )
}

export default Piso3

import React from 'react'
import Department from './Department'
import { StairsU, NewStairs } from './Stairs'

const PisoPB = () => {
  return (
    <a-entity id="piso-pb">
      {/* Grado / Taquilla */}
      <Department
        id="grado-taquilla"
        position="0 0 0"
        trigger={{
          width: 7, height: 3, depth: 10,
          title: 'Grado / Taquilla',
          description: 'Área encargada de la recepción de documentos y gestión de grados.',
          position: '0 1.5 0'
        }}
        floor={{
          width: 7, height: 23,
          position: '0 0 6.5',
          color: '#CCCCCC'
        }}
        label={{ text: 'Grado / Taquilla', position: '0 2 0' }}
      >
        <a-box className="estructura-fija" position="0 1.5 -5" width="7" height="3" depth="0.1" color="#999999"></a-box>
        <a-box className="estructura-fija" position="-3.5 1.5 0" width="0.1" height="3" depth="10" color="#999999"></a-box>
        <a-box position="3.5 1.5 -2.25" width="0.1" height="3" depth="5.5" color="#999999"></a-box>
        <a-box position="3.5 2.6 1.25" width="0.1" height="0.8" depth="1.5" color="#999999"></a-box>
        <a-box position="3.5 1.5 3.5" width="0.1" height="3" depth="3" color="#999999"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="7" height="3" depth="0.1" color="#999999"></a-box>
      </Department>

      {/* Pasillo 1 con Escaleras */}
      <a-entity id="pasillo" position="5.5 0 0">
        <a-plane className="suelo-piso" position="0 0 6.5" rotation="-90 0 0" width="4" height="23" color="#CCCCCC"></a-plane>
        <StairsU />
      </a-entity>

      {/* Registro y Control Complex */}
      <Department
        id="registro-control-complex"
        position="11 0 0"
        trigger={{
          width: 2.5, height: 3, depth: 3.5,
          title: 'Registro y Control',
          description: 'Área de registro y control de documentos.',
          position: '2.25 1.5 -3.25'
        }}
        floor={{
          width: 7, height: 23,
          position: '0 0 6.5',
          color: '#CCCCCC'
        }}
        label={{ text: 'Registro y Control', position: '2.25 2 -3.25' }}
      >
        {/* Additional Triggers for Registro y Control to cover the L-shape */}
        <a-box className="clickable" data-dept-name="Registro y Control" position="-1.25 1.5 -3.25" width="4.5" height="3" depth="3.5" material="opacity: 0; transparent: true" mostrar-info="titulo: Registro y Control; descripcion: Registro y control de documentos."></a-box>
        <a-box className="clickable" data-dept-name="Registro y Control" position="-1.25 1.5 1.25" width="4.5" height="3" depth="1.5" material="opacity: 0; transparent: true" mostrar-info="titulo: Registro y Control; descripcion: Registro y control de documentos."></a-box>
        <a-box className="clickable" data-dept-name="Registro y Control" position="0.25 1.5 -0.5" width="1.5" height="3" depth="2" material="opacity: 0; transparent: true" mostrar-info="titulo: Registro y Control; descripcion: Registro y control de documentos."></a-box>

        {/* Paredes Exteriores */}
        <a-box className="estructura-fija" position="0 1.5 -5" width="7" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-3.5 1.5 -2.25" width="0.1" height="3" depth="5.5" color="#999999"></a-box>
        <a-box position="-3.5 2.6 1.25" width="0.1" height="0.8" depth="1.5" color="#999999"></a-box>
        <a-box position="-3.5 1.5 3.5" width="0.1" height="3" depth="3" color="#999999"></a-box>
        <a-box position="3.5 1.5 0" width="0.1" height="3" depth="10" color="#999999"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="7" height="3" depth="0.1" color="#999999"></a-box>

        {/* Divisiones Internas Pasillo */}
        <a-box position="-2.0 1.5 0.5" width="3" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-2.0 1.5 2.0" width="3" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="0.25 2.6 2.0" width="1.5" height="0.8" depth="0.1" color="#999999"></a-box>

        {/* Pared divisoria vertical central */}
        <a-box position="1 1.5 -2" width="0.1" height="3" depth="2" color="#999999"></a-box>
        <a-box position="1 2.6 -0.5" width="0.1" height="0.8" depth="1" color="#999999"></a-box>
        <a-box position="1 1.5 2.5" width="0.1" height="3" depth="5" color="#999999"></a-box>

        {/* Seguro Social */}
        <a-entity id="seguro-social">
          <a-box className="clickable" data-dept-name="Seguro Social" position="-2.375 1.5 3.5" width="2.25" height="3" depth="3" material="opacity: 0; transparent: true" mostrar-info="titulo: Seguro Social; descripcion: Oficina de atención del Seguro Social."></a-box>
          <a-text value="Seguro Social" position="-2.375 2 3.5" align="center" color="#333" side="double" scale="0.8 0.8 0.8"></a-text>
        </a-entity>

        {/* HCM */}
        <a-entity id="hcm">
          <a-box className="clickable" data-dept-name="HCM" position="-0.125 1.5 3.5" width="2.25" height="3" depth="3" material="opacity: 0; transparent: true" mostrar-info="titulo: HCM; descripcion: Oficina de atención de HCM."></a-box>
          <a-text value="HCM" position="-0.125 2 3.5" align="center" color="#333" side="double"></a-text>
        </a-entity>

        {/* Enfermería */}
        <a-entity id="enfermeria">
          <a-box className="clickable" data-dept-name="Enfermería" position="-2.0 1.5 -0.5" width="3" height="3" depth="2" material="opacity: 0; transparent: true" mostrar-info="titulo: Enfermería; descripcion: Área de atención médica."></a-box>
          <a-box position="-2.0 1.5 -1.5" width="3" height="3" depth="0.1" color="#999999"></a-box>
          <a-box position="-0.5 1.5 -1.25" width="0.1" height="3" depth="0.5" color="#999999"></a-box>
          <a-box position="-0.5 2.6 -0.5" width="0.1" height="0.8" depth="1.0" color="#999999"></a-box>
          <a-box position="-0.5 1.5 0.25" width="0.1" height="3" depth="0.5" color="#999999"></a-box>
          <a-box position="-0.5 1.5 -2.0" width="0.1" height="3" depth="1.0" color="#999999"></a-box>
          <a-text value="Enfermería" position="-2.0 2 -0.5" align="center" color="#333" side="double"></a-text>
        </a-entity>

        {/* Archivo */}
        <a-entity id="archivo">
          <a-box className="clickable" data-dept-name="Archivo" position="2.25 1.5 1.75" width="2.5" height="3" depth="6.5" material="opacity: 0; transparent: true" mostrar-info="titulo: Archivo; descripcion: Almacenamiento de documentos."></a-box>
          <a-box position="2.25 1.5 -1.5" width="2.5" height="3" depth="0.1" color="#999999"></a-box>
          <a-text value="Archivo" position="2.25 2 1.75" align="center" color="#333" side="double"></a-text>
        </a-entity>
      </Department>

      {/* Auditoría Interna */}
      <Department
        id="auditoria-interna"
        position="18 0 0"
        trigger={{
          width: 7, height: 3, depth: 10,
          title: 'Auditoría Interna',
          description: 'Área de auditoría interna.',
          position: '0 1.5 0'
        }}
        floor={{
          width: 7, height: 18,
          position: '0 0 4',
          color: '#CCCCCC'
        }}
        label={{ text: 'Auditoría Interna', position: '0 2 0' }}
      >
        <a-box className="estructura-fija" position="0 1.5 -5" width="7" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-3.5 1.5 0" width="0.1" height="3" depth="10" color="#999999"></a-box>
        <a-box position="3.5 1.5 -2.25" width="0.1" height="3" depth="5.5" color="#999999"></a-box>
        <a-box position="3.5 2.6 1.25" width="0.1" height="0.8" depth="1.5" color="#999999"></a-box>
        <a-box position="3.5 1.5 3.5" width="0.1" height="3" depth="3" color="#999999"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="7" height="3" depth="0.1" color="#999999"></a-box>
      </Department>

      {/* Pasillo 2 */}
      <a-entity id="pasillo2" position="23.5 0 0">
        <a-plane className="suelo-piso" position="0 0 4" rotation="-90 0 0" width="4" height="18" color="#CCCCCC"></a-plane>
        {/* Escaleras Pasillo 2 */}
        <a-entity position="0 0 0">
          <a-box position="-0.1 1.4 -3.5" width="3.8" height="0.2" depth="2" color="#999999"></a-box>
          <a-box position="-0.1 0.7 -3.5" width="3.8" height="1.4" depth="2" color="#999999"></a-box>
          <StairsU />
        </a-entity>
      </a-entity>

      {/* Habilitaduría */}
      <Department
        id="habilitaduria"
        position="28.5 0 0"
        trigger={{
          width: 6, height: 3, depth: 10,
          title: 'Habilitaduría',
          description: 'Área de habilitaduría.',
          position: '0 1.5 0'
        }}
        floor={{
          width: 6, height: 18,
          position: '0 0 4',
          color: '#CCCCCC'
        }}
        label={{ text: 'Habilitaduría', position: '0 2 0' }}
      >
        <a-box className="estructura-fija" position="0 1.5 -5" width="6" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-3 1.5 -2.25" width="0.1" height="3" depth="5.5" color="#999999"></a-box>
        <a-box position="-3 2.6 1.25" width="0.1" height="0.8" depth="1.5" color="#999999"></a-box>
        <a-box position="-3 1.5 3.5" width="0.1" height="3" depth="3" color="#999999"></a-box>
        <a-box position="3 1.5 0" width="0.1" height="3" depth="10" color="#999999"></a-box>
        <a-box className="pared-frontal" position="0 1.5 5" width="6" height="3" depth="0.1" color="#999999"></a-box>
      </Department>

      {/* Relaciones Interinstitucionales */}
      <Department
        id="relaciones-inter"
        position="34 0 0"
        trigger={{
          width: 5, height: 3, depth: 10,
          title: 'Relaciones Interinstitucionales',
          description: 'Oficina de relaciones interinstitucionales.',
          position: '0 1.5 0'
        }}
        floor={{
          width: 5, height: 18,
          position: '0 0 4',
          color: '#CCCCCC'
        }}
        label={{ text: 'Relaciones\nInterinstitucionales', position: '0 2 0' }}
      >
        <a-box className="estructura-fija" position="0 1.5 -5" width="5" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-2.5 1.5 0" width="0.1" height="3" depth="10" color="#999999"></a-box>
        <a-box position="2.5 1.5 1" width="0.1" height="3" depth="12" color="#999999"></a-box>

        {/* Fachada Relaciones (Puerta detallada) */}
        <a-entity class="pared-frontal" position="0 0 5">
          <a-box position="-1.55 1.5 0" width="1.9" height="3" depth="0.1" color="#999999"></a-box>
          <a-box position="1.55 1.5 0" width="1.9" height="3" depth="0.1" color="#999999"></a-box>
          <a-box position="0 2.6 0" width="1.2" height="0.8" depth="0.1" color="#999999"></a-box>
          <a-box position="-0.6 1.5 0" width="0.05" height="3" depth="0.1" color="#777"></a-box>
          <a-box position="0.6 1.5 0" width="0.05" height="3" depth="0.1" color="#777"></a-box>
          <a-entity position="-0.6 0 0.05" rotation="0 45 0">
            <a-box position="0.55 1.1 0" width="1.1" height="2.2" depth="0.05" color="#888"></a-box>
            <a-sphere position="1.0 1.1 0.05" radius="0.05" color="#333"></a-sphere>
          </a-entity>
        </a-entity>

        {/* Portón de Rejas */}
        <a-entity id="porton-rejas" position="2.5 0 10">
          <a-box position="0 2.85 0" width="0.1" height="0.15" depth="6" color="#999999"></a-box>
          <a-box position="0 0.4 0" width="0.1" height="0.15" depth="6" color="#999999"></a-box>
          {[...Array(9)].map((_, i) => (
            <a-box key={i} position={`0 1.625 ${-2.5 + i * 0.5}`} width="0.05" height="2.3" depth="0.05" color="#999999"></a-box>
          ))}
          <a-box position="0 1.5 1.8" width="0.1" height="3" depth="0.1" color="#777"></a-box>
          <a-entity position="0 0 1.8" rotation="0 -60 0.05">
            <a-box position="0 1.5 0.6" width="0.08" height="2.8" depth="1.2" color="#888"></a-box>
            <a-sphere position="0.08 1.4 1.0" radius="0.06" color="#333"></a-sphere>
          </a-entity>
          <a-cylinder position="0 0.15 -2" rotation="0 0 90" radius="0.15" height="0.15" color="#111"></a-cylinder>
          <a-cylinder position="0 0.15 0" rotation="0 0 90" radius="0.15" height="0.15" color="#111"></a-cylinder>
          <a-cylinder position="0 0.15 2" rotation="0 0 90" radius="0.15" height="0.15" color="#111"></a-cylinder>
        </a-entity>
      </Department>

      {/* Habitación 6: Sala Situacional / Prensa / Empanadas */}
      <a-entity id="sala-situacional-complex" position="40.5 0 0">
        <a-plane className="suelo-piso" position="0 0 0" rotation="-90 0 0" width="8" height="10" color="#CCCCCC"></a-plane>

        {/* Triggers Sub-zonas */}
        <Department id="sala-situacional" trigger={{ width: 8, height: 3, depth: 3, title: 'Sala Situacional', position: '0 1.5 -3.5' }} label={{ text: 'Sala Situacional', position: '0 2 -3.5', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="archivo-2" trigger={{ width: 4, height: 3, depth: 1.4, title: 'Archivo 2', position: '-2 1.5 -1.3' }} label={{ text: 'Archivo 2', position: '-2 2 -1.3', scale: '0.6 0.6 0.6' }} floor={{ width: 0 }} />
        <Department id="recepcion-pb" trigger={{ width: 2, height: 3, depth: 1.4, title: 'Recepción', position: '1 1.5 -1.3' }} label={{ text: 'Recepción', position: '1 2 -1.3', scale: '0.6 0.6 0.6' }} floor={{ width: 0 }} />
        <Department id="prensa" trigger={{ width: 4, height: 3, depth: 4.4, title: 'Prensa', position: '2 1.5 2.8' }} label={{ text: 'Prensa', position: '2 2 2.8', scale: '0.8 0.8 0.8' }} floor={{ width: 0 }} />
        <Department id="empanadas" trigger={{ width: 4, height: 3, depth: 3.4, title: 'Puesto de empanadas', position: '-2 1.5 3.3' }} label={{ text: 'Puesto de\nempanadas', position: '-2 2 2.8', scale: '0.6 0.6 0.6' }} floor={{ width: 0 }} />

        {/* Paredes Perimetrales y Pasillo Entrada */}
        <a-box className="estructura-fija" position="0 1.5 -5" width="8" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="4 1.5 -2.8" width="0.1" height="3" depth="4.4" color="#999999"></a-box>
        <a-box position="4 2.6 0" width="0.1" height="0.8" depth="1.2" color="#999999"></a-box>
        <a-box position="4 1.5 2.8" width="0.1" height="3" depth="4.4" color="#999999"></a-box>

        {/* Divisiones Internas Fieles al HTML */}
        <a-box position="-2 1.5 -0.6" width="4" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="1.0 0.75 -0.6" width="2.0" height="1.5" depth="0.1" color="#999999"></a-box>
        <a-box position="-2 1.5 1.6" width="4" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="1.5 1.5 0.6" width="3" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="3.5 2.6 0.6" width="1" height="0.8" depth="0.1" color="#999999"></a-box>

        {/* Nuevas Divisiones Horizontales/Verticales */}
        <a-box position="-2.5 1.5 -2.0" width="3" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="0 2.6 -2.0" width="2" height="0.8" depth="0.1" color="#999999"></a-box>
        <a-box position="1.5 1.5 -2.0" width="1" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="2.6 2.6 -2.0" width="1.2" height="0.8" depth="0.1" color="#999999"></a-box>
        <a-box position="3.6 1.5 -2.0" width="0.8" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="0 1.5 -1.3" width="0.1" height="3" depth="1.4" color="#999999"></a-box>
        <a-box position="2 0.75 -1.3" width="0.1" height="1.5" depth="1.4" color="#999999"></a-box>
        <a-box position="0 1.5 2.8" width="0.1" height="3" depth="4.4" color="#999999"></a-box>
        <a-box position="-2 1.5 2.8" width="4" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="2 1.5 2.8" width="0.1" height="3" depth="4.4" color="#999999"></a-box>

        {/* Fachada Frontal (Empanadas con puerta ancha) */}
        <a-box className="pared-frontal" position="2 1.5 5" width="4" height="3" depth="0.1" color="#999999"></a-box>
        <a-box className="pared-frontal" position="-3.5 1.5 5" width="1" height="3" depth="0.1" color="#999999"></a-box>
        <a-box className="pared-frontal" position="-0.5 1.5 5" width="1" height="3" depth="0.1" color="#999999"></a-box>
        <a-box className="pared-frontal" position="-2 2.6 5" width="2" height="0.8" depth="0.1" color="#999999"></a-box>

        {/* Entrada Derecha / Pasillo Ensanchado */}
        <a-plane position="5.5 0 0" rotation="-90 0 0" width="3" height="1.2" color="#E5E5E5"></a-plane>
        <a-box position="6.0 0.25 -0.4" width="2.0" height="0.5" depth="0.5" color="#4A6D91"></a-box>
        <a-box position="6.0 0.25 1.4" width="2.0" height="0.5" depth="0.5" color="#4A6D91"></a-box>
        <a-cylinder position="5.0 1.75 -0.6" radius="0.06" height="2.5" color="#4A6D91"></a-cylinder>
        <a-cylinder position="7.0 1.75 -0.6" radius="0.06" height="2.5" color="#4A6D91"></a-cylinder>
        <a-cylinder position="5.0 1.75 1.6" radius="0.06" height="2.5" color="#4A6D91"></a-cylinder>
        <a-cylinder position="7.0 1.75 1.6" radius="0.06" height="2.5" color="#4A6D91"></a-cylinder>

        {/* Techo Triangular */}
        <a-entity position="0 0 0">
          <a-box position="5.25 3.0 0.5" width="2.5" height="0.1" depth="2.5" color="#4A6D91"></a-box>
          <a-entity geometry="primitive: triangle; vertexA: 0 0.5 0; vertexB: -1.25 0 0; vertexC: 1.25 0 0" position="7.0 3.0 0.5" rotation="0 90 0" material="color: #4A6D91; side: double"></a-entity>
          <a-box position="6.75 3.25 -0.125" rotation="-21.8 0 0" width="0.5" height="0.1" depth="1.36" color="#4A6D91"></a-box>
          <a-box position="6.75 3.25 1.125" rotation="21.8 0 0" width="0.5" height="0.1" depth="1.36" color="#4A6D91"></a-box>
          <a-box position="6.75 3.0 0.5" width="0.5" height="0.1" depth="2.5" color="#4A6D91"></a-box>
        </a-entity>

        <NewStairs />
      </a-entity>

      {/* Muro Perimetral Global */}
      <a-entity id="muro-perimetral-global">
        <a-box position="20 1.5 -5" width="40" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="25.5 1.5 13.1" width="22" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="14.5 1.5 15.5" width="0.1" height="3" depth="5" color="#999999"></a-box>
        <a-box position="5.5 1.5 18" width="18" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="-3.5 1.5 11.5" width="0.1" height="3" depth="13" color="#999999"></a-box>

        {/* Cierre lateral derecho */}
        <a-box position="43 1.5 -5" width="6" height="3" depth="0.1" color="#999999"></a-box>
        <a-box position="46 1.5 4.05" width="0.1" height="3" depth="18.2" color="#999999"></a-box>
        <a-box position="41.25 1.5 13.1" width="9.5" height="3" depth="0.1" color="#999999"></a-box>
      </a-entity>

    </a-entity>
  )
}

export default PisoPB

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PisoPB from './PisoPB'
import Piso1 from './Piso1'
import Piso2 from './Piso2'
import Piso3 from './Piso3'

const MapScene = () => {
  const [activeFloor, setActiveFloor] = useState('todos')
  const [selectedDept, setSelectedDept] = useState(null)
  const [info, setInfo] = useState({ title: '', description: '', visible: false })

  const departments = {
    pb: ['Archivo', 'Archivo 2', 'Auditoría Interna', 'Enfermería', 'Grado / Taquilla', 'Habilitaduría', 'HCM', 'Prensa', 'Puesto de empanadas', 'Recepción', 'Registro y Control', 'Relaciones Interinstitucionales', 'Sala Situacional', 'Seguro Social'],
    p1: ['Control De Estudios', 'Servicios Generales', 'Oficina 1', 'Oficina 2', 'Registro de bienes', 'Asesoría Jurídica', 'Consejo Universitario', 'Secretaría'],
    p2: ['Área Técnicos NODO', 'Servidores NODO', 'Programadores NODO', 'Recepción NODO', 'Planificación', 'Laberinto', 'V.R. Académico', 'Despacho'],
    p3: ['Finanzas', 'Presupuesto', 'Administración', 'Nómina', 'Baño', 'Reclutamiento y Selección', 'RRHH', 'Contabilidad', 'V.R. Administrativo', 'Adiestramiento', 'Higiene y Seguridad']
  }

  useEffect(() => {
    if (!window.AFRAME) return

    // Register custom info component
    if (!window.AFRAME.components['mostrar-info']) {
      window.AFRAME.registerComponent('mostrar-info', {
        schema: {
          titulo: { type: 'string', default: '' },
          descripcion: { type: 'string', default: '' }
        },
        init: function () {
          var el = this.el
          var data = this.data

          el.addEventListener('mouseenter', function () {
            if (!el.classList.contains('selected')) {
              el.setAttribute('material', 'opacity: 0.5; color: #4FC3F7')
            }
            window.dispatchEvent(new CustomEvent('show-info', {
              detail: { title: data.titulo, description: data.descripcion }
            }))
          })

          el.addEventListener('mouseleave', function () {
            if (!el.classList.contains('selected')) {
              el.setAttribute('material', 'opacity: 0; transparent: true')
            }
            window.dispatchEvent(new CustomEvent('hide-info'))
          })

          el.addEventListener('click', function () {
            window.dispatchEvent(new CustomEvent('select-dept', {
              detail: { title: data.titulo, element: el }
            }))
          })
        }
      })
    }

    // NEW: Register WASD Panning component for Orbit Controls
    if (!window.AFRAME.components['wasd-panning']) {
      window.AFRAME.registerComponent('wasd-panning', {
        schema: {
          speed: { type: 'number', default: 0.8 }
        },
        init: function () {
          this.keys = {}
          this.onKeyDown = (e) => { this.keys[e.code] = true }
          this.onKeyUp = (e) => { this.keys[e.code] = false }
          window.addEventListener('keydown', this.onKeyDown)
          window.addEventListener('keyup', this.onKeyUp)
        },
        remove: function () {
          window.removeEventListener('keydown', this.onKeyDown)
          window.removeEventListener('keyup', this.onKeyUp)
        },
        tick: function (time, timeDelta) {
          const controls = this.el.components['orbit-controls']?.controls
          if (!controls) return

          const speed = this.data.speed * (timeDelta / 16)
          let moveX = 0
          let moveZ = 0

          if (this.keys['KeyW'] || this.keys['ArrowUp']) moveZ -= 1
          if (this.keys['KeyS'] || this.keys['ArrowDown']) moveZ += 1
          if (this.keys['KeyA'] || this.keys['ArrowLeft']) moveX -= 1
          if (this.keys['KeyD'] || this.keys['ArrowRight']) moveX += 1

          if (moveX !== 0 || moveZ !== 0) {
            // Move target relative to current camera rotation for intuitive movement
            const camera = this.el.getObject3D('camera')
            const rotation = camera.rotation.y

            const worldMoveX = moveX * Math.cos(rotation) + moveZ * Math.sin(rotation)
            const worldMoveZ = moveZ * Math.cos(rotation) - moveX * Math.sin(rotation)

            controls.target.x += worldMoveX * speed
            controls.target.z += worldMoveZ * speed
          }
        }
      })
    }

    const handleShowInfo = (e) => {
      setInfo({ title: e.detail.title, description: e.detail.description, visible: true })
    }

    const handleHideInfo = () => setInfo(prev => ({ ...prev, visible: false }))

    const handleSelectDept = (e) => {
      const title = e.detail.title
      setSelectedDept(title)
      const clickedEl = e.detail.element

      // Selection highlight: Clear all
      document.querySelectorAll('.clickable.selected').forEach(sel => {
        sel.classList.remove('selected')
        sel.setAttribute('material', 'opacity: 0; transparent: true')
      })

      // Highlight ALL blocks of the same department (Case-insensitive)
      const allMatching = Array.from(document.querySelectorAll('.clickable')).filter(el => {
        const nameAttr = el.getAttribute('data-dept-name') || ''
        const infoAttr = el.getAttribute('mostrar-info') || ''
        return nameAttr.toLowerCase().trim() === title.toLowerCase().trim() ||
          infoAttr.toLowerCase().includes(`titulo: ${title.toLowerCase().trim()}`)
      })

      allMatching.forEach(sel => {
        sel.classList.add('selected')
        sel.setAttribute('material', 'opacity: 0.6; color: #81D4FA')
      })

      if (clickedEl && clickedEl.object3D) {
        // CAMERA FOCUS LOGIC
        const cameraEl = document.getElementById('main-camera')
        if (cameraEl) {
          // Ensure matrices are up to date for accurate world position
          clickedEl.object3D.updateMatrixWorld(true)
          const worldPos = new window.AFRAME.THREE.Vector3()
          clickedEl.object3D.getWorldPosition(worldPos)

          console.log('Focusing camera on:', title, worldPos)

          // Force restart animations by removing them first
          cameraEl.removeAttribute('animation__target')
          cameraEl.removeAttribute('animation__pos')

          // Use a small timeout to ensure A-Frame registers the removal
          setTimeout(() => {
            // Smoothly animate the orbit-controls target
            cameraEl.setAttribute('animation__target', {
              property: 'orbit-controls.target',
              to: `${worldPos.x.toFixed(2)} ${worldPos.y.toFixed(2)} ${worldPos.z.toFixed(2)}`,
              dur: 1000,
              easing: 'easeInOutQuad'
            })

            // Smoothly animate the camera position (Focus view)
            cameraEl.setAttribute('animation__pos', {
              property: 'position',
              to: `${(worldPos.x - 12).toFixed(2)} ${(worldPos.y + 12).toFixed(2)} ${(worldPos.z + 12).toFixed(2)}`,
              dur: 1000,
              easing: 'easeInOutQuad'
            })
          }, 10)
        }
      }
    }

    window.addEventListener('show-info', handleShowInfo)
    window.addEventListener('hide-info', handleHideInfo)
    window.addEventListener('select-dept', handleSelectDept)

    return () => {
      window.removeEventListener('show-info', handleShowInfo)
      window.removeEventListener('hide-info', handleHideInfo)
      window.removeEventListener('select-dept', handleSelectDept)
    }
  }, [])

  // Explicit visibility toggle for A-Frame floors and Camera Movement
  useEffect(() => {
    const floors = {
      pb: document.getElementById('render-piso-pb'),
      p1: document.getElementById('render-piso-1'),
      p2: document.getElementById('render-piso-2'),
      p3: document.getElementById('render-piso-3')
    }
    Object.entries(floors).forEach(([key, el]) => {
      if (el) el.setAttribute('visible', (activeFloor === 'todos' || activeFloor === key))
    })

    // Camera movement logic
    const cameraEl = document.getElementById('main-camera')
    if (!cameraEl) return

    const configs = {
      todos: { target: '20 8 0', pos: '20 45 80' },
      pb: { target: '22 1.5 5', pos: '-5 25 40' },
      p1: { target: '22 9.5 5', pos: '-5 33 40' },
      p2: { target: '22 17.5 5', pos: '-5 41 40' },
      p3: { target: '22 25.5 5', pos: '-5 49 40' }
    }

    const config = configs[activeFloor] || configs.todos

    // Smoothly animate the orbit-controls target
    cameraEl.setAttribute('animation__target', {
      property: 'orbit-controls.target',
      to: config.target,
      dur: 1500,
      easing: 'easeInOutQuad'
    })

    // Smoothly animate the camera position (Isometric look)
    cameraEl.setAttribute('animation__pos', {
      property: 'position',
      to: config.pos,
      dur: 1500,
      easing: 'easeInOutQuad'
    })
  }, [activeFloor])

  const selectDepartmentManually = (deptName) => {
    let targetFloor = null
    for (const [f, dList] of Object.entries(departments)) {
      if (dList.includes(deptName)) {
        targetFloor = f
        break
      }
    }
    setSelectedDept(deptName)
    if (activeFloor !== 'todos' && targetFloor && activeFloor !== targetFloor) {
      setActiveFloor(targetFloor)
    }

    // Increased timeout to allow floor transition to settle or ensure DOM availability
    setTimeout(() => {
      // Use more robust selector for finding departments in the scene
      const el = document.querySelector(`[data-dept-name="${deptName}"], [mostrar-info*="titulo: ${deptName}"]`)
      if (el) {
        // Use native click() if possible, or dispatch CustomEvent as backup
        if (typeof el.click === 'function') {
          el.click()
        } else {
          el.dispatchEvent(new CustomEvent('click'))
        }
      }
    }, 600)
  }

  return (
    <div style={{ width: '100%', height: '85vh', position: 'relative', overflow: 'hidden' }}>
      <a-scene
        embedded
        vr-mode-ui="enabled: false"
        cursor="rayOrigin: mouse"
        raycaster="objects: .clickable"
        background="color: #1a1c23"
        renderer="colorManagement: true; antialias: true; logarithmicDepthBuffer: true"
      >

        {/* ADDED wasd-panning component to camera entity */}
        <a-entity
          id="main-camera"
          camera
          look-controls="enabled: false"
          orbit-controls="target: 20 8 0; minDistance: 5; maxDistance: 220; initialPosition: 20 60 120; rotateSpeed: 0.5; enableDamping: true"
          wasd-panning="speed: 1.2"
        ></a-entity>

        <a-light type="ambient" color="#ffffff" intensity="0.5"></a-light>
        <a-light type="hemisphere" color="#ffffff" groundColor="#333" intensity="0.6"></a-light>
        <a-light type="directional" color="#FFF" intensity="0.8" position="20 50 30"></a-light>

        <a-entity id="render-piso-pb" position="0 0 0"><PisoPB /></a-entity>
        <a-entity id="render-piso-1" position="0 8 0"><Piso1 /></a-entity>
        <a-entity id="render-piso-2" position="0 16 0"><Piso2 /></a-entity>
        <a-entity id="render-piso-3" position="0 24 0"><Piso3 /></a-entity>

      </a-scene>

      {/* UI overlays */}
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={selectorWrapStyle}>
        <div style={selectorStyle}>
          <button onClick={() => { setActiveFloor('todos'); setSelectedDept(null) }} style={pillBtnStyle(activeFloor === 'todos')}>Ver Todo</button>
          <button onClick={() => setActiveFloor('pb')} style={pillBtnStyle(activeFloor === 'pb')}>PB</button>
          <button onClick={() => setActiveFloor('p1')} style={pillBtnStyle(activeFloor === 'p1')}>P1</button>
          <button onClick={() => setActiveFloor('p2')} style={pillBtnStyle(activeFloor === 'p2')}>P2</button>
          <button onClick={() => setActiveFloor('p3')} style={pillBtnStyle(activeFloor === 'p3')}>P3</button>
        </div>
      </motion.div>

      <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={sidebarStyle}>
        <h4 style={sidebarHeaderStyle}>Nomenclatura</h4>
        <div style={deptListStyle} className="hide-scrollbar">
          {Object.entries(departments).map(([floor, list]) => {
            if (activeFloor !== 'todos' && activeFloor !== floor) return null
            return list.map(dept => (
              <motion.button whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} key={dept} onClick={() => selectDepartmentManually(dept)} style={deptBtnStyle(selectedDept === dept)}>{dept}</motion.button>
            ))
          })}
        </div>
      </motion.div>

      <AnimatePresence>
        {info.visible && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} style={infoPanelStyle}>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <div>
                <div style={infoLabelStyle}>Información del Área</div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#1A237E', fontWeight: '800' }}>{info.title}</h2>
              </div>
            </div>
            <p style={{ margin: '10px 0 0 0', color: '#455A64', fontSize: '13px', lineHeight: '1.4' }}>{info.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const sidebarHeaderStyle = { color: '#fff', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', textAlign: 'center', backgroundColor: 'rgba(33, 150, 243, 0.95)', padding: '10px', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.4)', fontWeight: 'bold' }
const selectorWrapStyle = { position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }
const selectorStyle = { backgroundColor: 'rgba(255, 255, 255, 1)', padding: '12px 24px', borderRadius: '40px', boxShadow: '0 10px 40px rgba(0,0,0,0.3)', display: 'flex', gap: '12px', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(15px)' }
const pillBtnStyle = (active) => ({ height: '36px', padding: '0 20px', border: 'none', backgroundColor: active ? '#2196F3' : '#f0f0f0', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', color: active ? '#fff' : '#555', transform: active ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.25s ease', fontSize: '13px', boxShadow: active ? '0 5px 15px rgba(33, 150, 243, 0.4)' : 'none' })
const sidebarStyle = { position: 'absolute', top: '80px', left: '20px', width: '220px', zIndex: 100, maxHeight: '78vh', display: 'flex', flexDirection: 'column' }
const deptListStyle = { display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', padding: '8px', scrollbarWidth: 'none' }
const deptBtnStyle = (active) => ({ padding: '12px 14px', border: 'none', borderLeft: active ? '6px solid #1976D2' : '6px solid transparent', backgroundColor: active ? '#E3F2FD' : 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: active ? 'bold' : '500', color: active ? '#0D47A1' : '#1A237E', textAlign: 'left', boxShadow: active ? '0 4px 12px rgba(25, 118, 210, 0.25)' : '0 2px 6px rgba(0,0,0,0.08)', transition: 'all 0.2s ease' })
const infoPanelStyle = { position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(255, 255, 255, 0.98)', color: '#333', padding: '22px 35px', borderRadius: '24px', zIndex: 100, minWidth: '340px', boxShadow: '0 15px 60px rgba(0,0,0,0.5)', borderTop: '6px solid #2196F3', textAlign: 'center', backdropFilter: 'blur(10px)' }
const infoLabelStyle = { fontSize: '11px', color: '#78909C', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px', fontWeight: 'bold' }

export default MapScene

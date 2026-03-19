import React from 'react'

const Department = ({
  id,
  position = '0 0 0',
  rotation = '0 0 0',
  trigger = {},
  floor = {},
  label = {},
  children
}) => {
  const {
    width: tWidth = 7,
    height: tHeight = 3,
    depth: tDepth = 10,
    title = 'Título',
    description = 'Descripción',
    position: tPosition = '0 1.5 0',
    color: tColor = '#81D4FA',
    opacity: tOpacity = 0 // Transparent by default until hovered
  } = trigger

  const {
    width: fWidth = 7,
    height: fHeight = 23,
    color: fColor = '#CCCCCC',
    position: fPosition = '0 0 6.5',
    rotation: fRotation = '-90 0 0',
    visible: fVisible = true,
  } = floor

  const {
    text,
    position: lPosition = '0 2 0',
    color: lColor = '#333',
    align = 'center',
    side = 'double'
  } = label

  return (
    <a-entity id={id} position={position} rotation={rotation}>
      {/* Trigger Box - Improved with data-dept-name for easier lookup */}
      {trigger && (
        <a-box
          className="clickable"
          data-dept-name={title}
          position={tPosition}
          width={tWidth}
          height={tHeight}
          depth={tDepth}
          material={`opacity: ${tOpacity}; transparent: true; color: ${tColor}; side: double`}
          mostrar-info={`titulo: ${title}; descripcion: ${description}`}
        ></a-box>
      )}

      {/* Floor */}
      {floor && fWidth > 0 && (
        <a-plane
          class="suelo-piso"
          position={fPosition}
          rotation={fRotation}
          width={fWidth}
          height={fHeight}
          color={fColor}
          visible={fVisible}
        ></a-plane>
      )}

      {/* Label */}
      {text && (
        <a-text
          value={text}
          position={lPosition}
          align={align}
          color={lColor}
          side={side}
        ></a-text>
      )}

      {/* Walls and Furniture */}
      {children}
    </a-entity>
  )
}

export default Department

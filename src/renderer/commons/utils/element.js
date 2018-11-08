import * as geo from './geo'

export function htmlToSvg(scale, val) {
  return val / scale
}

export function svgToHtml(scale, val) {
  return val * scale
}

export function resizeElement({ element, x, y, drawMode, scale }) {
  switch (element.name) {
    case 'rectangle':
    case 'circle':
      return resizeRectangle({ element, x, y, drawMode, scale })
    case 'line':
      return resizeLine({ element, x, y, drawMode, scale })
    default:
      return element
  }
}

function resizeLine({ element, x, y, drawMode, scale }) {
  let to = null
  if (drawMode === 'resizeLine1') {
    to = {
      id: element.id,
      x1: x,
      y1: y
    }
  } else if (drawMode === 'resizeLine2') {
    to = {
      id: element.id,
      x2: x,
      y2: y
    }
  } else {
    to = {
      id: element.id
    }
  }
  return to
}

function resizeRectangle({ element, x, y, drawMode, scale }) {
  let to = null
  if (drawMode === 'resize') {
    const rotateElement = geo.rotateRectangleAtCenter(element, element.radian)
    const rec = geo.rotateRectangleAtCenter(
      {
        x: rotateElement.x,
        y: rotateElement.y,
        width: x - rotateElement.x,
        height: y - rotateElement.y
      },
      -element.radian
    )
    to = {
      id: element.id,
      ...rec
    }
  } else if (drawMode === 'resizeWidth') {
    const d = geo.distance(geo.getRectangleCenter(element), { x, y })
    to = {
      id: element.id,
      strokeWidth: Math.min(
        Math.max((d - element.height / 2 - htmlToSvg(scale, 15)) * 2, 1),
        element.height
      )
    }
  } else {
    to = {
      id: element.id,
      radian:
        geo.getRadian(geo.getRectangleCenter(element), { x, y }) + Math.PI / 2
    }
  }
  return to
}

export function toRectangle(element) {
  switch (element.name) {
    case 'line':
      const x = Math.min(element.x1, element.x2)
      const y = Math.min(element.y1, element.y2)
      return {
        x,
        y,
        width: Math.abs(element.x1 - element.x2),
        height: Math.abs(element.y1 - element.y2)
      }
    default:
      return element
  }
}

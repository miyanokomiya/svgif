import * as geo from './geo'
import { getRectangle, getCircle, getLine } from '@/commons/models/svgElements'

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

export function moveLineItemDiffVector({ element, scale }) {
  const unitVector = geo.unitVector(
    { x: element.x1, y: element.y1 },
    { x: element.x2, y: element.y2 }
  )
  const d = htmlToSvg(scale, 15)
  return {
    x: unitVector.x * d,
    y: unitVector.y * d
  }
}

function resizeLine({ element, x, y, drawMode, scale }) {
  let to = null
  if (drawMode === 'resizeLine1') {
    const diffV = moveLineItemDiffVector({ element, scale })
    to = {
      id: element.id,
      x1: x + diffV.x,
      y1: y + diffV.y
    }
  } else if (drawMode === 'resizeLine2') {
    const diffV = moveLineItemDiffVector({ element, scale })
    to = {
      id: element.id,
      x2: x - diffV.x,
      y2: y - diffV.y
    }
  } else if (drawMode === 'resizeWidth') {
    const d = geo.distance(geo.getRectangleCenter(toRectangle(element)), {
      x,
      y
    })
    to = {
      id: element.id,
      strokeWidth: Math.max((d - htmlToSvg(scale, 15)) * 2, 1)
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

export function moveElement({ element, vec }) {
  const to = { ...element }
  switch (element.name) {
    case 'rectangle':
    case 'circle':
      to.x += vec.x
      to.y += vec.y
      return geo.getNormalRect(to)
    case 'line':
      to.x1 += vec.x
      to.y1 += vec.y
      to.x2 += vec.x
      to.y2 += vec.y
      return to
  }
  return to
}

export function createElement({ elementType, elementColor, x, y }) {
  switch (elementType) {
    case 'rectangle':
      return getRectangle({ x, y, stroke: elementColor })
    case 'circle':
      return getCircle({ x, y, stroke: elementColor })
    case 'line':
      return getLine({
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        stroke: elementColor
      })
  }
  throw new Error('unknown element type: ', elementType)
}

export function getModeAfterCreateElement(element) {
  switch (element.name) {
    case 'rectangle':
    case 'circle':
      return 'resize'
    case 'line':
      return 'resizeLine1'
  }
  throw new Error('unknown element type: ', element.name)
}

import * as geo from './geo'
import {
  getRectangle,
  getCircle,
  getLine,
  getArrow,
  getText
} from '@/commons/models/svgElements'

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
    case 'arrow':
      return resizeLine({ element, x, y, drawMode, scale })
    case 'text':
      return {
        ...element,
        fontSize: textHeightToFontSize(element, element.y - y)
      }
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
  } else if (drawMode === 'startResizeArrow2') {
    const fromP = { x: element.x1, y: element.y1 }
    const toP = { x: element.x2, y: element.y2 }
    const vec = geo.vector(toP, { x, y })
    const distance = geo.distance(fromP, toP)
    const radian = geo.getRadian(fromP, toP)
    const rotatedVec = geo.rotate(vec, -radian)
    to = {
      id: element.id,
      radius2: Math.max(-rotatedVec.y - element.strokeWidth / 2, 0),
      depth2: Math.min(Math.max(-rotatedVec.x, 0), distance)
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
    const center = geo.getRectangleCenter(element)
    const adjustedP = geo.rotate({ x, y }, -element.radian, center)
    adjustedP.x -= element.strokeWidth / 2
    adjustedP.y -= element.strokeWidth / 2
    const width = adjustedP.x - element.x
    const height = adjustedP.y - element.y
    to = {
      id: element.id,
      x: element.x,
      y: element.y,
      width,
      height
    }
    // 矩形始点のずれを直す
    const rotatedTo = geo.rotateRectangleAtCenter(to, element.radian)
    const rotatedElement = geo.rotateRectangleAtCenter(element, element.radian)
    to.x -= rotatedTo.x - rotatedElement.x
    to.y -= rotatedTo.y - rotatedElement.y
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
    case 'arrow':
      const x = Math.min(element.x1, element.x2)
      const y = Math.min(element.y1, element.y2)
      return {
        x,
        y,
        width: Math.abs(element.x1 - element.x2),
        height: Math.abs(element.y1 - element.y2)
      }
    case 'text':
      return {
        x: element.x,
        y: element.y,
        width: 1,
        height: 1
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
    case 'text':
      to.x += vec.x
      to.y += vec.y
      return geo.getNormalRect(to)
    case 'line':
    case 'arrow':
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
    case 'arrow':
      return getArrow({
        x1: x,
        y1: y,
        x2: x,
        y2: y,
        stroke: elementColor
      })
    case 'text':
      return getText({ x, y, stroke: elementColor })
  }
  throw new Error('unknown element type: ', elementType)
}

export function getModeAfterCreateElement(element) {
  switch (element.name) {
    case 'rectangle':
    case 'circle':
      return 'resize'
    case 'line':
    case 'arrow':
      return 'resizeLine2'
    case 'text':
      return 'move'
  }
  throw new Error('unknown element type: ', element.name)
}

export function getTextElementLineHeight(element) {
  return element.fontSize * 0.85
}

export function getTextLines(element) {
  if (!element.text) return ['<= Input Text']
  return element.text.split(/\n|\r\n/)
}

export function getTextElementHeight(element) {
  return (
    getTextElementLineHeight(element) * getTextLines(element).length -
    element.fontSize * 0.12
  )
}

export function textHeightToFontSize(element, height) {
  return (
    (Math.abs(height) + element.fontSize * 0.12) /
    getTextLines(element).length /
    0.85
  )
}

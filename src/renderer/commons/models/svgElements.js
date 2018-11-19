import { createId } from './base'

function getBaseProps(arg = {}) {
  return {
    id: arg.id || createId(),
    stroke: 'tomato',
    strokeWidth: 10,
    ...arg
  }
}

export function getRectangle(arg = {}) {
  return {
    ...getBaseProps(arg),
    name: 'rectangle',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    radian: 0,
    defaultAspect: 1, // width / height
    base64: '',
    ...arg
  }
}

export function getCircle(arg = {}) {
  return {
    ...getRectangle(arg),
    name: 'circle',
    ...arg
  }
}

export function getText(arg = {}) {
  return {
    ...getBaseProps(arg),
    name: 'text',
    text: '',
    fontSize: 10,
    ...arg
  }
}

export function getLine(arg = {}) {
  return {
    ...getBaseProps(arg),
    name: 'line',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    strokeWidth: 30,
    ...arg
  }
}

export function getArrow(arg = {}) {
  return {
    ...getLine(arg),
    name: 'arrow',
    radius2: 30,
    depth2: 50,
    ...arg
  }
}

export function completeElement(elm = {}) {
  const getter = getElementGetter(elm.name)
  return getter(elm)
}

function getElementGetter(name) {
  switch (name) {
    case 'rectangle':
      return getRectangle
    case 'circle':
      return getCircle
    case 'text':
      return getText
    case 'line':
      return getLine
    case 'arrow':
      return getArrow
    default:
      throw new Error('invalid element name: ' + name)
  }
}

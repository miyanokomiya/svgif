import { createId } from './base'

function getBaseProps() {
  return {
    id: createId(),
    stroke: 'tomato',
    strokeWidth: 5
  }
}

export function getRectangle(arg = {}) {
  return {
    ...getBaseProps(),
    name: 'rectangle',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    radian: 0,
    ...arg
  }
}

export function getCircle(arg = {}) {
  return {
    ...getRectangle(),
    name: 'circle',
    ...arg
  }
}

export function getLine(arg = {}) {
  return {
    ...getBaseProps(),
    name: 'line',
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    strokeWidth: 30,
    ...arg
  }
}

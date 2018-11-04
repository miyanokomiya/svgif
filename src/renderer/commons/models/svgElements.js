import { createId } from './base'

function getBaseProps() {
  return {
    id: createId(),
    stroke: 'tomato',
    strokeWidth: 5
  }
}

export function getRectangle(arg) {
  return {
    name: 'rectangle',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    radian: 0,
    ...getBaseProps(),
    ...arg
  }
}

export function getCircle(arg) {
  return {
    name: 'circle',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    ...getBaseProps(),
    ...arg
  }
}

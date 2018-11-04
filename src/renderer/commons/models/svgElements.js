import { createId } from './base'

export function getRectangle(arg) {
  return {
    id: createId(),
    name: 'rect',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    stroke: 'tomato',
    strokeWidth: 5,
    radian: 0,
    ...arg
  }
}

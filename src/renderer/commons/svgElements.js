function createId() {
  return Math.random() + 1
}

export function getRectangle(arg) {
  return {
    id: createId(),
    name: 'rect',
    x: 0,
    y: 0,
    width: 1,
    height: 1,
    stroke: 'black',
    strokeWidth: 5,
    radian: 0,
    ...arg
  }
}

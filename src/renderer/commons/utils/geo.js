// //////
// 判定系
// //////

export function isPointInRect(rect, p) {
  if (p.x < rect.x) return false
  if (p.y < rect.y) return false
  if (rect.x + rect.width < p.x) return false
  if (rect.y + rect.height < p.y) return false
  return true
}

export function isRectInRect(outer, inner) {
  if (!isPointInRect(outer, { x: inner.x, y: inner.y })) return false
  if (!isPointInRect(outer, { x: inner.x, y: inner.y + inner.height }))
    return false
  if (!isPointInRect(outer, { x: inner.x + inner.width, y: inner.y }))
    return false
  if (
    !isPointInRect(outer, {
      x: inner.x + inner.width,
      y: inner.y + inner.height
    })
  )
    return false
  return true
}

// //////
// 座標系
// //////

export function distance(p1, p2) {
  return norm(vector(p1, p2))
}

export function norm(v) {
  return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
}

export function vector(from, to) {
  return {
    x: to.x - from.x,
    y: to.y - from.y
  }
}

export function unitVector(from, to) {
  const v = vector(from, to)
  const n = norm(v)
  if (n === 0) return { x: 0, y: 0 }
  return {
    x: v.x / n,
    y: v.y / n
  }
}

export function center(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  }
}

export function crossVector(vec) {
  return { x: vec.y, y: -vec.x }
}

export function getNormalRect(rec) {
  const to = { ...rec }
  if (to.width < 0) {
    to.width *= -1
    to.x -= to.width
  }
  if (to.height < 0) {
    to.height *= -1
    to.y -= to.height
  }
  return to
}

export function getRadian(from, to) {
  const v = vector(from, to)
  return Math.atan2(v.y, v.x)
}

export function getRectangleCenter(rec) {
  return {
    x: rec.x + rec.width / 2,
    y: rec.y + rec.height / 2
  }
}

export function rotateRectangleAtCenter(rec, rad) {
  const c = getRectangleCenter(rec)
  const p1 = rotate(rec, rad, c)
  const p2 = rotate({ x: rec.x + rec.width, y: rec.y + rec.height }, rad, c)
  return {
    x: p1.x,
    y: p1.y,
    width: p2.x - p1.x,
    height: p2.y - p1.y
  }
}

export function rotate(p, radian, base = { x: 0, y: 0 }) {
  const vec = vector(base, p)
  const rotateVec = {
    x: vec.x * Math.cos(radian) - vec.y * Math.sin(radian),
    y: vec.x * Math.sin(radian) + vec.y * Math.cos(radian)
  }
  return {
    x: base.x + rotateVec.x,
    y: base.y + rotateVec.y
  }
}

export function fitNearValue(val, list = [], threshold = 0) {
  const nearList = list
    .map(a => ({ val: a, dif: Math.abs(a - val) }))
    .filter(info => info.dif <= threshold)
    .sort((a, b) => a.dif - b.dif)
  return nearList.length > 0 ? nearList[0].val : val
}

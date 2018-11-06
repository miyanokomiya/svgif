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
  const bx = rec.x - c.x
  const by = rec.y - c.y
  const bw = rec.width / 2
  const bh = rec.height / 2
  const rx = Math.cos(rad) * bx - Math.sin(rad) * by
  const ry = Math.sin(rad) * bx + Math.cos(rad) * by
  const rw = Math.cos(rad) * bw - Math.sin(rad) * bh
  const rh = Math.sin(rad) * bw + Math.cos(rad) * bh
  return {
    x: c.x + rx,
    y: c.y + ry,
    width: rw * 2,
    height: rh * 2
  }
}

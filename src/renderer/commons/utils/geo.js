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

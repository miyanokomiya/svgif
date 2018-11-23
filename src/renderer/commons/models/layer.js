import { createId, createDate } from './base'
import { getSvgElementProps, copleteSvgElementProps } from './clip'

export function getLayer(layer = {}) {
  return {
    id: layer.id || createId(),
    createdAt: layer.createdAt || createDate(new Date()),
    from: 0,
    to: 1000,
    ...layer,
    ...getSvgElementProps(layer)
  }
}

// 過去データを考慮してデータを補完する
export function completeLayer(layer = {}) {
  return {
    id: layer.id || createId(),
    createdAt: layer.createdAt || createDate(new Date()),
    from: 0,
    to: 1000,
    ...layer,
    ...copleteSvgElementProps(layer)
  }
}

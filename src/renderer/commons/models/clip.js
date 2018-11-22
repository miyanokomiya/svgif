import { createId, createDate } from './base'
import { completeElement } from './svgElements'

export function getClip(clip) {
  return {
    id: clip.id || createId(),
    createdAt: clip.createdAt || createDate(new Date()),
    delay: 1000,
    base64: '',
    width: 0,
    height: 0,
    ...clip,
    svgElementList: clip.svgElementList
      ? clip.svgElementList.map(elm => ({ id: createId(), ...elm }))
      : [],
    svgElementUndoStack: clip.svgElementUndoStack
      ? clip.svgElementUndoStack.map(data => JSON.parse(JSON.stringify(data)))
      : [],
    svgElementRedoStack: clip.svgElementRedoStack
      ? clip.svgElementRedoStack.map(data => JSON.parse(JSON.stringify(data)))
      : []
  }
}

// 過去データを考慮してデータを補完する
export function completeClip(clip = {}) {
  const svgElementList = (clip.svgElementList || []).map(completeElement)
  const svgElementUndoStack = (clip.svgElementUndoStack || []).map(
    data =>
      data.type === 'REMOVE' ? completeSvgElementHistoryStack(data) : data
  )
  const svgElementRedoStack = (clip.svgElementRedoStack || []).map(
    data => (data.type === 'ADD' ? completeSvgElementHistoryStack(data) : data)
  )
  return {
    id: clip.id || createId(),
    createdAt: clip.createdAt || createDate(new Date()),
    delay: 1000,
    base64: '',
    width: 0,
    height: 0,
    ...clip,
    svgElementList,
    svgElementUndoStack,
    svgElementRedoStack
  }
}

function completeSvgElementHistoryStack(stack = {}) {
  const svgElementList = (stack.svgElementList || []).map(completeElement)
  return {
    ...stack,
    svgElementList
  }
}

import { createId, createDate } from './base'
import { completeElement } from './svgElements'

export function getClip(clip = {}) {
  return {
    id: clip.id || createId(),
    createdAt: clip.createdAt || createDate(new Date()),
    delay: 1000,
    base64: '',
    width: 0,
    height: 0,
    ...clip,
    ...getSvgElementProps(clip)
  }
}

function cloneSvgElementList(svgElementList) {
  return svgElementList.map(elm => ({ ...elm, id: createId() }))
}

export function getSvgElementProps(clip = {}) {
  return {
    svgElementList: clip.svgElementList
      ? cloneSvgElementList(clip.svgElementList)
      : [],
    svgElementUndoStack: clip.svgElementUndoStack
      ? clip.svgElementUndoStack.map(data => {
          const clone = JSON.parse(JSON.stringify(data))
          return {
            ...clone,
            svgElementList: cloneSvgElementList(data.svgElementList)
          }
        })
      : [],
    svgElementRedoStack: clip.svgElementRedoStack
      ? clip.svgElementRedoStack.map(data => {
          const clone = JSON.parse(JSON.stringify(data))
          return {
            ...clone,
            svgElementList: cloneSvgElementList(data.svgElementList)
          }
        })
      : []
  }
}

// 過去データを考慮してデータを補完する
export function completeClip(clip = {}) {
  return {
    id: clip.id || createId(),
    createdAt: clip.createdAt || createDate(new Date()),
    delay: 1000,
    base64: '',
    width: 0,
    height: 0,
    ...clip,
    ...copleteSvgElementProps(clip)
  }
}

export function copleteSvgElementProps(clip) {
  const svgElementList = (clip.svgElementList || []).map(completeElement)
  const svgElementUndoStack = (clip.svgElementUndoStack || []).map(
    data =>
      data.type === 'REMOVE' ? completeSvgElementHistoryStack(data) : data
  )
  const svgElementRedoStack = (clip.svgElementRedoStack || []).map(
    data => (data.type === 'ADD' ? completeSvgElementHistoryStack(data) : data)
  )
  return { svgElementList, svgElementUndoStack, svgElementRedoStack }
}

function completeSvgElementHistoryStack(stack = {}) {
  const svgElementList = (stack.svgElementList || []).map(completeElement)
  return {
    ...stack,
    svgElementList
  }
}

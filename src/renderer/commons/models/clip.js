import { createId, createDate } from './base'

export function getClip(clip) {
  return {
    id: createId(),
    createdAt: createDate(new Date()),
    delay: 300,
    base64: '',
    width: 0,
    height: 0,
    ...clip,
    svgElementList: clip.svgElementList
      ? clip.svgElementList.map(elm => ({ id: createId(), ...elm }))
      : []
  }
}

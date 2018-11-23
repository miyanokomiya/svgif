import Vue from 'vue'
import SvgRender from '@/components/organisms/SvgRender'

export function createGif({ clipList, size, maxSize, layerList }) {
  maxSize = maxSize || Math.max(size.width, size.height)
  const rate = maxSize / Math.max(size.width, size.height)
  return new Promise((resolve, reject) => {
    createImageList(clipList).then(imageList => {
      const gif = new window.GIF({
        workers: 2,
        quality: 10,
        width: size.width * rate,
        height: size.height * rate
      })
      const canvas = document.createElement('canvas')
      canvas.width = size.width * rate
      canvas.height = size.height * rate
      const ctx = canvas.getContext('2d')

      const promiseList = getFrameInfoList({ clipList, layerList }).map(
        ({ clip, layerList, delay }, index) => () =>
          addGifFrame({
            ctx,
            size,
            image: imageList.find(info => info.clipId === clip.id).image,
            clip,
            layerList,
            delay,
            gif,
            rate
          })
      )

      promiseList
        .reduce((m, p) => m.then(p), Promise.resolve())
        .then(() => {
          gif.on('finished', blob => {
            resolve(blob)
          })
          gif.render()
        })
        .catch(reject)
    })
  })
}

export function splitFrame(rangeList) {
  const splitedList = []
  rangeList.forEach(range => {
    splitedList.push(range.from)
    splitedList.push(range.to)
  })
  const ret = splitedList
    .filter((x, i, self) => {
      return self.indexOf(x) === i
    })
    .sort((a, b) => a - b)
  // 最後の区切りは不要
  ret.pop()
  return ret
}

export function getFrameInfo({ clipList, layerList, currentTime }) {
  let current = 0
  let currentClip = null
  clipList.some(clip => {
    if (current <= currentTime && currentTime < current + clip.delay) {
      currentClip = clip
      return true
    }
    current += clip.delay
  })
  const currentLayerList = layerList.filter(
    l => l.from <= currentTime && currentTime < l.to
  )
  return {
    clip: currentClip,
    layerList: currentLayerList
  }
}

export function getFrameInfoList({ clipList, layerList }) {
  let current = 0
  const clipRangeList = clipList.map(clip => {
    const range = {
      from: current,
      to: current + clip.delay
    }
    current += clip.delay
    return range
  })
  const frameList = splitFrame([
    ...clipRangeList,
    ...layerList.map(l => ({ from: l.from, to: l.to }))
  ])
  return frameList.map((currentTime, i) => {
    return {
      ...getFrameInfo({ clipList, layerList, currentTime }),
      delay:
        i < frameList.length - 1
          ? frameList[i + 1] - currentTime
          : clipList.reduce((sum, c) => sum + c.delay, 0) - currentTime
    }
  })
}

function createImageList(clipList) {
  const imageMap = {}
  return Promise.all(
    clipList.map((clip, index) => {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = clip.base64
        image.onload = () => {
          imageMap[index] = { image, clipId: clip.id }
          resolve()
        }
      })
    })
  ).then(() => {
    return Object.keys(imageMap)
      .sort((a, b) => {
        return parseInt(a) - parseInt(b)
      })
      .map(key => imageMap[key])
  })
}

function addGifFrame({ ctx, size, image, clip, layerList, delay, gif, rate }) {
  return new Promise((resolve, reject) => {
    ctx.beginPath()
    ctx.rect(0, 0, size.width * rate, size.height * rate)
    ctx.fillStyle = '#eee'
    ctx.fill()
    const imageRect = {
      x: ((size.width - image.width) / 2) * rate,
      y: ((size.height - image.height) / 2) * rate,
      width: image.width * rate,
      height: image.height * rate
    }
    ctx.rect(imageRect.x, imageRect.y, imageRect.width, imageRect.height)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.stroke()
    ctx.drawImage(
      image,
      0,
      0,
      image.width,
      image.height,
      imageRect.x,
      imageRect.y,
      imageRect.width,
      imageRect.height
    )

    const svgElementList = clip.svgElementList.concat(
      layerList.reduce((list, layer) => list.concat(layer.svgElementList), [])
    )

    if (svgElementList.length === 0) {
      gif.addFrame(ctx, { copy: true, delay })
      resolve()
    } else {
      const vm = new Vue({
        components: { SvgRender },
        template: '<SvgRender :svgElementList="svgElementList" :size="size" />',
        data: () => ({
          svgElementList,
          size
        })
      })
      vm.$mount()
      const DOMURL = self.URL || self.webkitURL || self
      const img = new Image()
      const svg = new Blob([vm.$el.outerHTML], {
        type: 'image/svg+xml;charset=utf-8'
      })
      const url = DOMURL.createObjectURL(svg)
      img.onload = () => {
        ctx.drawImage(
          img,
          0,
          0,
          size.width,
          size.height,
          0,
          0,
          size.width * rate,
          size.height * rate
        )
        gif.addFrame(ctx, { copy: true, delay })
        DOMURL.revokeObjectURL(url)
        resolve()
      }
      img.src = url
      img.onerror = reject
    }
  })
}

import Vue from 'vue'
import SvgRender from '@/components/organisms/SvgRender'

export function createGif({ clipList, size }) {
  return new Promise((resolve, reject) => {
    createImageList(clipList).then(imageList => {
      const gif = new window.GIF({
        workers: 2,
        quality: 10,
        width: size.width,
        height: size.height
      })
      const canvas = document.createElement('canvas')
      canvas.width = size.width
      canvas.height = size.height
      const ctx = canvas.getContext('2d')

      const promiseList = clipList.map((clip, index) => () =>
        addGifFrame({ ctx, size, image: imageList[index], clip, gif })
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

function createImageList(clipList) {
  const imageMap = {}
  return Promise.all(
    clipList.map((clip, index) => {
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = clip.base64
        image.onload = () => {
          imageMap[index] = image
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

function addGifFrame({ ctx, size, image, clip, gif }) {
  return new Promise((resolve, reject) => {
    ctx.clearRect(0, 0, size.width, size.height)
    ctx.drawImage(
      image,
      (size.width - image.width) / 2,
      (size.height - image.height) / 2
    )

    if (clip.svgElementList.length === 0) {
      gif.addFrame(ctx, { copy: true, delay: clip.delay || 200 })
      resolve()
    } else {
      const vm = new Vue({
        components: { SvgRender },
        template: '<SvgRender :svgElementList="svgElementList" :size="size" />',
        data: () => ({
          svgElementList: clip.svgElementList,
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
        ctx.drawImage(img, 0, 0, size.width, size.height)
        gif.addFrame(ctx, { copy: true, delay: clip.delay || 200 })
        DOMURL.revokeObjectURL(url)
        resolve()
      }
      img.src = url
      img.onerror = reject
    }
  })
}

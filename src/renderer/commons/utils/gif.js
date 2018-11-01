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
      clipList.forEach((clip, index) => {
        ctx.clearRect(0, 0, size.width, size.height)
        const image = imageList[index]
        ctx.drawImage(
          imageList[index],
          (size.width - image.width) / 2,
          (size.height - image.height) / 2
        )
        gif.addFrame(ctx, { copy: true, delay: clip.delay || 200 })
      })
      gif.on('finished', blob => {
        resolve(blob)
      })
      gif.render()
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

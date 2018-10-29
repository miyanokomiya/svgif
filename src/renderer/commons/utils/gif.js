export function createGif({ clipList }) {
  return new Promise((resolve, reject) => {
    createImageList(clipList).then(imageList => {
      const gif = new window.GIF({
        workers: 2,
        quality: 10
      })
      clipList.forEach((clip, index) => {
        gif.addFrame(imageList[index], { delay: clip.delay || 200 })
      })
      gif.on('finished', function(blob) {
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

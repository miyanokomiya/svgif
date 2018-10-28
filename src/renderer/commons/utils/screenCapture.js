import { desktopCapturer } from 'electron'

export function screenshot({ range, imageFormat }) {
  return getFullScreenSource().then(stream =>
    convertStreamToBase64({ stream, range, imageFormat })
  )
}

function convertStreamToBase64({ stream, range, imageFormat = 'image/jpeg' }) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      video.style.height = video.videoHeight + 'px'
      video.style.width = video.videoWidth + 'px'
      const canvas = document.createElement('canvas')
      canvas.width = range.width
      canvas.height = range.height
      canvas
        .getContext('2d')
        .drawImage(
          video,
          range.x,
          range.y,
          range.width,
          range.height,
          0,
          0,
          canvas.width,
          canvas.height
        )
      video.remove()
      try {
        stream.getTracks()[0].stop()
      } catch (e) {
        reject(e)
      }
      resolve({ base64: canvas.toDataURL(imageFormat) })
    }
    video.src = URL.createObjectURL(stream)
  })
}

function getFullScreenSource() {
  return new Promise((resolve, reject) => {
    desktopCapturer.getSources(
      { types: ['window', 'screen'] },
      (e, sources) => {
        if (e) return reject(e)
        const source = sources.find(s => s.name === 'Entire screen')
        if (!source) return reject(new Error('not found screen source.'))
        navigator.webkitGetUserMedia(
          {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id,
                minWidth: window.parent.screen.width,
                maxWidth: window.parent.screen.width,
                minHeight: window.parent.screen.height,
                maxHeight: window.parent.screen.height
              }
            }
          },
          resolve,
          reject
        )
      }
    )
  })
}

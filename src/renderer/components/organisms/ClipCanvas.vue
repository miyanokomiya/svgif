<template>
  <div
    class="clip-canvas"
    @dragover.prevent="e => e.dataTransfer.dropEffect = 'copy'"
    @dragleave.prevent
    @drop.prevent="dropFile"
  >
    <template v-if="SELECTED_CLIP">
      <div class="canvas" ref="wrapper">
        <ImagePanel
          :src="SELECTED_CLIP.base64"
          :width="imageSize.width"
          :height="imageSize.height"
        />
        <SvgCanvas
          class="svg"
          :style="{ width: `${WHOLE_SIZE.width * scale}px`, height: `${WHOLE_SIZE.height * scale}px` }"
          :width="WHOLE_SIZE.width"
          :height="WHOLE_SIZE.height"
          @mousedown.native.self="mousedownSelf"
          @mousedown.native="mousedown"
          @mousemove.native="mousemove"
          @mouseup.native="mouseup"
        >
          <SvgElement
            v-for="svgElement in localSvgElementList"
            class="svg-element"
            :key="svgElement.id"
            :svgElement="svgElement"
            :moveVec="selectedIdMap[svgElement.id] ? moveVec : undefined"
            :scale="scale"
            :selected="selectedIdMap[svgElement.id]"
            @startMove="startMoveElement"
            @startResize="startResizeElement"
            @startResizeWidth="startResizeWidth"
            @deleteElement="id => deleteSvgElement(id, true)"
          />
        </SvgCanvas>
      </div>
      <ClipTimeLine class="time-line" />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'
import { getPoint } from '@/commons/utils/canvas'
import { getRectangle, getCircle } from '@/commons/models/svgElements'
import { readImageFile } from '@/commons/utils/file'
import ImagePanel from '@/components/atoms/ImagePanel'
import SvgCanvas from '@/components/molecules/SvgCanvas'
import SvgElement from '@/components/molecules/SvgElement'
import ClipTimeLine from '@/components/organisms/ClipTimeLine'

export default {
  components: {
    ImagePanel,
    SvgCanvas,
    SvgElement,
    ClipTimeLine
  },
  data: () => ({
    scale: 1,
    downStartPoint: null,
    moveVec: { x: 0, y: 0 },
    localSvgElementList: [],
    drawMode: ['resize, resizeWidth'][0]
  }),
  computed: {
    ...mapGetters({
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE,
      CANVAS_MODE: clipTypes.g.CANVAS_MODE,
      ELEMENT_TYPE: clipTypes.g.ELEMENT_TYPE,
      ELEMENT_COLOR: clipTypes.g.ELEMENT_COLOR
    }),
    windowInfo() {
      return this.$svgif.windowInfo
    },
    selectedElementIdList: {
      get() {
        return this.$svgif.selectedElementIdList
      },
      set(val) {
        this.$svgif.selectedElementIdList = val
      }
    },
    imageSize() {
      const wRate = this.WHOLE_SIZE.width / this.SELECTED_CLIP.width
      const hRate = this.WHOLE_SIZE.height / this.SELECTED_CLIP.height
      const rate = Math.min(Math.min(wRate, hRate), 1)
      return {
        width: this.SELECTED_CLIP.width * this.scale * rate,
        height: this.SELECTED_CLIP.height * this.scale * rate
      }
    },
    svgElementList() {
      return this.SELECTED_CLIP ? this.SELECTED_CLIP.svgElementList : []
    },
    selectedElementList() {
      return this.selectedElementIdList
        .map(id => this.localSvgElementList.find(e => e.id === id))
        .filter(e => !!e)
    },
    selectedElement() {
      return this.selectedElementList.length === 1
        ? this.selectedElementList[0]
        : null
    },
    selectedIdMap() {
      return this.selectedElementIdList.reduce((map, id) => {
        map[id] = true
        return map
      }, {})
    },
    selectedAny() {
      return this.selectedElementList.length > 0
    }
  },
  mounted() {
    this.rescale()
    this.initLocalSvgElementList()
  },
  updated() {
    this.rescale()
  },
  watch: {
    windowInfo() {
      this.rescale()
    },
    SELECTED_CLIP() {
      this.rescale()
      this.selectedElementIdList = []
    },
    svgElementList() {
      this.initLocalSvgElementList()
    }
  },
  methods: {
    ...mapActions({
      _setCanvasMode: clipTypes.a.SET_CANVAS_MODE,
      _createSvgElement: clipTypes.a.CREATE_SVG_ELEMENT,
      _updateSvgElement: clipTypes.a.UPDATE_SVG_ELEMENT,
      _deleteSvgElement: clipTypes.a.DELETE_SVG_ELEMENT,
      _createClip: clipTypes.a.CREATE_CLIP
    }),
    htmlToSvg(val) {
      return val / this.scale
    },
    svgToHtml(val) {
      return val * this.scale
    },
    getSvgPoint(e) {
      const p = getPoint(e)
      return {
        x: this.htmlToSvg(p.x),
        y: this.htmlToSvg(p.y)
      }
    },
    setCanvasMode(mode) {
      this._setCanvasMode(mode)
    },
    rescale() {
      this.$nextTick(() => {
        if (!this.$refs.wrapper) return
        const wrapperRect = this.$refs.wrapper.getBoundingClientRect()
        const wRate = wrapperRect.width / this.WHOLE_SIZE.width
        const hRate = wrapperRect.height / this.WHOLE_SIZE.height
        const rate = Math.min(wRate, hRate)
        this.scale = Math.min(rate, 1)
      })
    },
    initLocalSvgElementList() {
      this.localSvgElementList = this.svgElementList.map(elm => ({ ...elm }))
    },
    createSvgElement(svgElement, commit = false) {
      this.localSvgElementList.push(svgElement)
      if (commit) {
        this._createSvgElement({
          clipId: this.SELECTED_CLIP.id,
          svgElement
        })
      }
    },
    updateSvgElementList(toList, commit = false) {
      toList.forEach(({ id, ...to }) => {
        const elm = this.localSvgElementList.find(elm => elm.id === id)
        Object.keys(to).forEach(key => {
          elm[key] = to[key]
        })
      })
      if (commit) {
        this._updateSvgElement({
          clipId: this.SELECTED_CLIP.id,
          svgElementList: toList
        })
      }
    },
    deleteSvgElement(svgElementId, commit = false) {
      this.clearSelectElement(svgElementId)
      const index = this.localSvgElementList.findIndex(
        elm => elm.id === svgElementId
      )
      this.localSvgElementList.splice(index, 1)
      if (commit) {
        this._deleteSvgElement({
          clipId: this.SELECTED_CLIP.id,
          svgElementId
        })
      }
    },
    selectElement(id, multi) {
      if (!multi) this.clearSelectElement()
      if (this.selectedIdMap[id]) return
      this.selectedElementIdList.push(id)
    },
    clearSelectElement(id) {
      if (id) {
        this.selectedElementIdList = this.selectedElementIdList.filter(
          selectedId => selectedId !== id
        )
      } else {
        this.selectedElementIdList = []
      }
    },
    toggleSelectElement(id) {
      this.selectedIdMap[id]
        ? this.clearSelectElement(id)
        : this.selectElement(id)
    },
    createElement({ x, y }) {
      switch (this.ELEMENT_TYPE) {
        case 'rectangle':
          return getRectangle({ x, y, stroke: this.ELEMENT_COLOR })
        case 'circle':
          return getCircle({ x, y, stroke: this.ELEMENT_COLOR })
      }
    },
    resizeElement({ element, x, y }) {
      switch (element.name) {
        case 'rectangle':
        case 'circle':
          const to =
            this.drawMode === 'resize'
              ? {
                  id: element.id,
                  width: x - element.x,
                  height: y - element.y
                }
              : {
                  id: element.id,
                  strokeWidth: Math.max(
                    (y - (element.y + element.height + this.htmlToSvg(15))) * 2,
                    1
                  )
                }
          this.updateSvgElementList([to])
      }
    },
    commitMoveElementList({ elementList, x, y }) {
      const toList = elementList.map(element => {
        // TODO localSvgElementList と moveVec の扱いが微妙
        const to = this.localSvgElementList.find(elm => elm.id === element.id)
        switch (element.name) {
          case 'rectangle':
          case 'circle':
            to.x += this.moveVec.x
            to.y += this.moveVec.y
            if (to.width < 0) {
              to.width *= -1
              to.x -= to.width
            }
            if (to.height < 0) {
              to.height *= -1
              to.y -= to.height
            }
            return to
        }
      })
      this.updateSvgElementList(toList, true)
    },
    mousedownSelf(e) {
      if (this.CANVAS_MODE === 'select') {
        setTimeout(() => {
          if (this.downStartPoint) return
          this.clearSelectElement()
        }, 200)
      } else if (this.CANVAS_MODE === 'draw') {
        const p = this.getSvgPoint(e)
        const elm = this.createElement({ ...p })
        this.createSvgElement(elm, true)
        this.selectElement(elm.id)
      }
    },
    mousedown(e) {
      this.downStartPoint = this.getSvgPoint(e)
    },
    mousemove(e) {
      if (!this.selectedAny) return
      if (!this.downStartPoint) return
      const p = this.getSvgPoint(e)
      if (this.CANVAS_MODE === 'move') {
        this.moveVec = {
          x: p.x - this.downStartPoint.x,
          y: p.y - this.downStartPoint.y
        }
      } else if (this.CANVAS_MODE === 'draw') {
        this.resizeElement({ element: this.selectedElement, ...p })
      }
    },
    mouseup(e) {
      if (this.CANVAS_MODE === 'move') {
        this.setCanvasMode('select')
      }
      this.commitMoveElementList({
        elementList: this.selectedElementList,
        ...this.moveVec
      })
      this.downStartPoint = null
      this.moveVec = { x: 0, y: 0 }
      this.drawMode = 'resize'
    },
    startMoveElement(id) {
      if (this.selectedIdMap[id]) {
        setTimeout(() => {
          if (this.downStartPoint) return
          this.clearSelectElement(id)
        }, 200)
      } else {
        this.selectElement(id, true)
      }
      this.setCanvasMode('move')
    },
    startResizeElement(id) {
      this.selectElement(id)
      this.setCanvasMode('draw')
      this.drawMode = 'resize'
    },
    startResizeWidth(id) {
      this.selectElement(id)
      this.setCanvasMode('draw')
      this.drawMode = 'resizeWidth'
    },
    dropFile(e) {
      const files = e.target.files
        ? [...e.target.files]
        : [...e.dataTransfer.files]
      // 順不同でロードが済んだ順にclip化
      files.forEach(file => {
        readImageFile(file)
          .then(({ base64, width, height }) => {
            this._createClip({
              clip: {
                base64,
                width,
                height
              }
            })
          })
          .catch(e => {
            this.$notify.error({
              title: 'Error',
              message: e.message
            })
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.clip-canvas {
  height: 100%;
  .canvas {
    height: calc(100% - 8rem);
    position: relative;
    user-select: none;
    .svg {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      border: 0.1rem solid black;
      user-select: none;
      .svg-element {
        cursor: pointer;
      }
    }
  }
}
</style>

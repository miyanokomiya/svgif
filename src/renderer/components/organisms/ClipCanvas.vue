<template>
  <div
    class="clip-canvas"
    @dragover.prevent="e => e.dataTransfer.dropEffect = 'copy'"
    @dragleave.prevent
    @drop.prevent="dropFile"
  >
    <template v-if="SELECTED_CLIP">
      <div
        class="canvas"
        ref="canvas"
        :style="{ height: `${$svgif.canvasSplitRate * 100}%` }"
      >
        <ImagePanel
          :src="SELECTED_CLIP.base64"
          :width="imageSize.width"
          :height="imageSize.height"
        />
        <SvgCanvas
          class="svg"
          tabindex="-1"
          ref="svgCanvas"
          :style="{ width: `${WHOLE_SIZE.width * scale}px`, height: `${WHOLE_SIZE.height * scale}px` }"
          :width="WHOLE_SIZE.width"
          :height="WHOLE_SIZE.height"
          @mousedown.native.self="mousedownSelf"
          @mousedown.native="mousedown"
          @mousemove.native="mousemove"
          @mouseup.native="mouseup"
          @keydown.native.67.ctrl.exact="copyElements"
          @keydown.native.67.meta.exact="copyElements"
          @keydown.native.86.ctrl.exact="pasteElements"
          @keydown.native.86.meta.exact="pasteElements"
          @keydown.native.65.ctrl.exact="selectAllElements"
          @keydown.native.65.meta.exact="selectAllElements"
          @keydown.native.88.ctrl.exact="cutElements"
          @keydown.native.88.meta.exact="cutElements"
          @keydown.native.90.ctrl.exact="undoSvgElement"
          @keydown.native.90.meta.exact="undoSvgElement"
          @keydown.native.90.ctrl.shift.exact="redoSvgElement"
          @keydown.native.90.meta.shift.exact="redoSvgElement"
          @dragover.native.prevent.stop="e => e.dataTransfer.dropEffect = 'copy'"
          @dragleave.native.prevent.stop
          @drop.native.prevent.stop="dropFileInCanvas"
        >
          <SvgElement
            v-for="svgElement in svgElementListBackGround"
            class="svg-element-background"
            :key="svgElement.id"
            :svgElement="svgElement"
            :scale="scale"
          />
          <SvgElement
            v-for="svgElement in localSvgElementList"
            class="svg-element"
            :key="svgElement.id"
            :svgElement="svgElement"
            :moveVec="selectedIdMap[svgElement.id]? elementMoveVec : undefined"
            :scale="scale"
            :selected="selectedIdMap[svgElement.id]"
            @startMove="startMoveElement"
            @startResize="startResizeElement"
            @startResizeWidth="startResizeWidth"
            @startRotate="startRotate"
            @deleteElement="id => deleteSvgElementList([id], true)"
            @startResizeLine1="startResizeLine1"
            @startResizeLine2="startResizeLine2"
            @startResizeArrow2="startResizeArrow2"
            @startEditText="startEditText"
          />
          <SvgRectangle
            v-if="selectRangeRectangle"
            :x="selectRangeRectangle.x"
            :y="selectRangeRectangle.y"
            :width="selectRangeRectangle.width"
            :height="selectRangeRectangle.height"
            stroke="gray"
            :strokeOpacity="0.7"
            :strokeWidth="htmlToSvg(5)"
            :strokeDasharray="[htmlToSvg(5), htmlToSvg(5), htmlToSvg(2), htmlToSvg(5)]"
          />
        </SvgCanvas>
      </div>
      <div :style="{ height: `${100 - $svgif.canvasSplitRate * 100}%` }">
        <DragHandler
          class="split-handler"
          @dragStart="moveCanvasSplitRateStart"
          @drag="moveCanvasSplitRate"
        >
          <div/><div/>
        </DragHandler>
        <ClipTimeLine class="time-line" />
      </div>
      <el-dialog title="Text" :visible.sync="showEtidTextDialog">
        <form @submit.prevent="changeText">
          <el-input
            v-model="editedText"
            type="textarea"
            autocomplete="off"
          />
        </form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showEtidTextDialog = false">Cancel</el-button>
          <el-button type="primary" @click="changeText">OK</el-button>
        </span>
      </el-dialog>
    </template>
    <template v-else>
      <div class="empty-board">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="startSelectFile"
        >
          Add Images
        </el-button>
        <p class="drop-text">or Drop Images</p>
      </div>
      <input
        v-show="false"
        ref="fileInput"
        multiple
        type="file"
        accept="image/*"
        @change="dropFile"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@/store/modules/clips/types'
import { getPoint } from '@/commons/utils/canvas'
import { readImageFile } from '@/commons/utils/file'
import * as geo from '@/commons/utils/geo'
import * as elementUtils from '@/commons/utils/element'
import ImagePanel from '@/components/atoms/ImagePanel'
import ClipTimeLine from '@/components/organisms/ClipTimeLine'
import SvgCanvas from '@/components/molecules/SvgCanvas'
import SvgElement from '@/components/molecules/SvgElement'
import SvgRectangle from '@/components/atoms/SvgRectangle'
import DragHandler from '@/components/atoms/DragHandler'
import { createId } from '@/commons/models/base'

export default {
  components: {
    ImagePanel,
    SvgCanvas,
    SvgElement,
    SvgRectangle,
    ClipTimeLine,
    DragHandler
  },
  data: () => ({
    scale: 1,
    downStartPoint: null,
    moveVec: { x: 0, y: 0 },
    localSvgElementList: [],
    drawMode: [
      'resize, resizeWidth',
      'rotate',
      'resizeLine1',
      'resizeLine2'
    ][0],
    canvasDragging: false,
    showEtidTextDialog: false,
    editedText: '',
    clipboard: [],
    canvasSplitRatePast: 0.7
  }),
  computed: {
    ...mapGetters({
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE,
      CURRENT_LAYER_LIST: clipTypes.g.CURRENT_LAYER_LIST,
      SELECTED_LAYER: clipTypes.g.SELECTED_LAYER,
      EDIT_TARGET_TYPE: clipTypes.g.EDIT_TARGET_TYPE,
      EDIT_TARGET_SVG_ELEMENT_CONTAINER:
        clipTypes.g.EDIT_TARGET_SVG_ELEMENT_CONTAINER
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
    isEditClip() {
      return this.EDIT_TARGET_TYPE === 'clip'
    },
    svgElementListBackGround() {
      if (this.isEditClip) {
        return this.CURRENT_LAYER_LIST.reduce(
          (list, layer) => [...list, ...layer.svgElementList],
          []
        )
      } else {
        return this.CURRENT_LAYER_LIST.filter(
          layer => !this.SELECTED_LAYER || layer.id !== this.SELECTED_LAYER.id
        ).reduce(
          (list, layer) => [...list, ...layer.svgElementList],
          this.SELECTED_CLIP.svgElementList
        )
      }
    },
    svgElementList() {
      return this.EDIT_TARGET_SVG_ELEMENT_CONTAINER
        ? this.EDIT_TARGET_SVG_ELEMENT_CONTAINER.svgElementList
        : []
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
    },
    selectRangeRectangle() {
      if (!this.canvasDragging) return
      if (this.$svgif.canvasMode !== 'select') return null
      if (!this.downStartPoint) return null
      if (!this.moveVec) return null
      return geo.getNormalRect({
        x: this.downStartPoint.x,
        y: this.downStartPoint.y,
        width: this.moveVec.x,
        height: this.moveVec.y
      })
    },
    elementMoveVec() {
      if (this.$svgif.canvasMode !== 'move') return { x: 0, y: 0 }
      return this.moveVec
    },
    canvasSplitRate() {
      return this.$svgif.canvasSplitRate
    }
  },
  mounted() {
    this.rescale()
    this.initLocalSvgElementList()
  },
  watch: {
    windowInfo() {
      this.rescale()
    },
    canvasSplitRate() {
      this.rescale()
    },
    SELECTED_CLIP() {
      this.rescale()
    },
    EDIT_TARGET_SVG_ELEMENT_CONTAINER() {
      this.selectedElementIdList = []
      this.focusCanvas()
    },
    svgElementList() {
      this.initLocalSvgElementList()
    },
    showEtidTextDialog() {
      this.clearMouseState()
      if (!this.showEtidTextDialog) this.focusCanvas()
    }
  },
  methods: {
    ...mapActions({
      _createSvgElement: clipTypes.a.CREATE_SVG_ELEMENT,
      _updateSvgElement: clipTypes.a.UPDATE_SVG_ELEMENT,
      _deleteSvgElement: clipTypes.a.DELETE_SVG_ELEMENT,
      _createClip: clipTypes.a.CREATE_CLIP,
      _undoSvgElement: clipTypes.a.UNDO_SVG_ELEMENT,
      _redoSvgElement: clipTypes.a.REDO_SVG_ELEMENT
    }),
    htmlToSvg(val) {
      return elementUtils.htmlToSvg(this.scale, val)
    },
    svgToHtml(val) {
      return elementUtils.svgToHtml(this.scale, val)
    },
    getSvgPoint(e) {
      const p = getPoint(e)
      return {
        x: this.htmlToSvg(p.x),
        y: this.htmlToSvg(p.y)
      }
    },
    focusCanvas() {
      if (this.$refs.svgCanvas) this.$refs.svgCanvas.$el.focus()
    },
    setCanvasMode(mode) {
      this.$svgif.canvasMode = mode
    },
    rescale() {
      this.$nextTick(() => {
        if (!this.$refs.canvas) return
        const wrapperRect = this.$refs.canvas.getBoundingClientRect()
        const wRate = wrapperRect.width / this.WHOLE_SIZE.width
        const hRate = wrapperRect.height / this.WHOLE_SIZE.height
        const rate = Math.min(wRate, hRate)
        // 小さすぎるスケールは避ける
        this.scale = Math.max(Math.min(rate, 1), 0.00001)
      })
    },
    initLocalSvgElementList() {
      this.localSvgElementList = this.svgElementList.map(elm => ({ ...elm }))
      this.selectedElementIdList = this.selectedElementIdList.filter(id =>
        this.localSvgElementList.find(elm => elm.id === id)
      )
    },
    createSvgElement(svgElementList, commit = false) {
      if (svgElementList.length === 0) return
      svgElementList.forEach(elm => {
        const index = this.localSvgElementList.findIndex(
          current => current.id === elm.id
        )
        if (index === -1) {
          this.localSvgElementList.push(elm)
        } else {
          this.localSvgElementList.splice(index, 1, {
            ...this.localSvgElementList[index],
            ...elm
          })
        }
      })
      if (commit) {
        this._createSvgElement({
          clipId: this.EDIT_TARGET_SVG_ELEMENT_CONTAINER.id,
          svgElementList
        })
      }
    },
    updateSvgElementList(toList, commit = false) {
      if (toList.length === 0) return
      toList.forEach(({ id, ...to }) => {
        const elm = this.localSvgElementList.find(elm => elm.id === id)
        Object.keys(to).forEach(key => {
          elm[key] = to[key]
        })
      })
      if (commit) {
        this._updateSvgElement({
          clipId: this.EDIT_TARGET_SVG_ELEMENT_CONTAINER.id,
          svgElementList: toList
        })
      }
    },
    deleteSvgElementList(svgElementIdList, commit = false) {
      if (svgElementIdList.length === 0) return
      svgElementIdList.forEach(svgElementId => {
        this.clearSelectElement(svgElementId)
        const index = this.localSvgElementList.findIndex(
          elm => elm.id === svgElementId
        )
        this.localSvgElementList.splice(index, 1)
      })
      if (commit) {
        this._deleteSvgElement({
          clipId: this.EDIT_TARGET_SVG_ELEMENT_CONTAINER.id,
          svgElementIdList
        })
      }
    },
    selectElement(id, multi) {
      if (!multi) this.clearSelectElement()
      if (this.selectedIdMap[id]) return
      this.selectedElementIdList.push(id)
    },
    selectAllElements() {
      this.selectedElementIdList = this.localSvgElementList.map(s => s.id)
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
      return elementUtils.createElement({
        elementType: this.$svgif.elementType,
        elementColor: this.$svgif.elementColor,
        x,
        y
      })
    },
    resizeElement({ element, x, y }) {
      const to = elementUtils.resizeElement({
        element,
        x,
        y,
        drawMode: this.drawMode,
        scale: this.scale
      })
      this.updateSvgElementList([to])
    },
    commitMoveElementList() {
      const elementList = this.selectedElementList.map(element =>
        elementUtils.moveElement({ element, vec: this.elementMoveVec })
      )
      // 新規追加分
      const createList = elementList.filter(
        elm => !this.svgElementList.find(org => org.id === elm.id)
      )

      // 移動がなければ新規作成分を破棄して終了
      if (this.moveVec.x === 0 && this.moveVec.y === 0) {
        this.initLocalSvgElementList()
        return
      }

      // 更新分
      const updateList = elementList.filter(elm =>
        this.svgElementList.find(org => org.id === elm.id)
      )
      this.createSvgElement(createList, true)
      this.updateSvgElementList(updateList, true)
    },
    mousedownSelf(e) {
      if (this.$svgif.canvasMode === 'select') {
        this.canvasDragging = true
        setTimeout(() => {
          if (this.downStartPoint) return
          this.clearSelectElement()
        }, 200)
      } else if (this.$svgif.canvasMode === 'draw') {
        const p = this.getSvgPoint(e)
        const elm = this.createElement({ ...p })
        this.createSvgElement([elm])
        this.selectElement(elm.id)
        this.drawMode = elementUtils.getModeAfterCreateElement(elm)
      }
    },
    mousedown(e) {
      this.downStartPoint = this.getSvgPoint(e)
    },
    mousemove(e) {
      if (!this.downStartPoint) return
      const p = this.getSvgPoint(e)
      this.moveVec = {
        x: p.x - this.downStartPoint.x,
        y: p.y - this.downStartPoint.y
      }
      if (this.$svgif.canvasMode === 'draw') {
        this.resizeElement({ element: this.selectedElement, ...p })
      }
    },
    mouseup(e) {
      this.commitMoveElementList()
      if (this.selectRangeRectangle) {
        this.localSvgElementList
          .filter(elm =>
            geo.isRectInRect(
              this.selectRangeRectangle,
              elementUtils.toRectangle(elm)
            )
          )
          .forEach(elm => this.selectElement(elm.id, true))
      }
      this.clearMouseState()
    },
    clearMouseState() {
      this.setCanvasMode('select')
      this.downStartPoint = null
      this.moveVec = { x: 0, y: 0 }
      this.drawMode = 'resize'
      this.canvasDragging = false
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
      this.startDrawMode(id, 'resize')
    },
    startResizeWidth(id) {
      this.startDrawMode(id, 'resizeWidth')
    },
    startRotate(id) {
      this.startDrawMode(id, 'rotate')
    },
    startResizeLine1(id) {
      this.startDrawMode(id, 'resizeLine1')
    },
    startResizeLine2(id) {
      this.startDrawMode(id, 'resizeLine2')
    },
    startResizeArrow2(id) {
      this.startDrawMode(id, 'startResizeArrow2')
    },
    startEditText(id) {
      this.selectElement(id)
      this.showEtidTextDialog = true
      this.editedText = this.selectedElement.text
    },
    changeText() {
      this.updateSvgElementList(
        [{ ...this.selectedElement, text: this.editedText }],
        true
      )
      this.showEtidTextDialog = false
      this.editedText = ''
    },
    startDrawMode(id, drawMode) {
      this.selectElement(id)
      this.setCanvasMode('draw')
      this.drawMode = drawMode
      this.$svgif.elementType = this.selectedElement.name
    },
    copyElements() {
      this.clipboard = this.selectedElementList.map(elm => ({ ...elm }))
    },
    pasteElements() {
      const list = this.clipboard.map(elm => ({ ...elm, id: createId() }))
      this.createSvgElement(list, true)
      this.clearSelectElement()
      list.forEach(elm => this.selectElement(elm.id, true))
    },
    cutElements() {
      this.copyElements()
      this.deleteSvgElementList(
        this.selectedElementList.map(elm => elm.id),
        true
      )
    },
    undoSvgElement() {
      this.clearSelectElement()
      this._undoSvgElement({
        clipId: this.EDIT_TARGET_SVG_ELEMENT_CONTAINER.id
      })
    },
    redoSvgElement() {
      this.clearSelectElement()
      this._redoSvgElement({
        clipId: this.EDIT_TARGET_SVG_ELEMENT_CONTAINER.id
      })
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
    },
    dropFileInCanvas(e) {
      const files = e.target.files
        ? [...e.target.files]
        : [...e.dataTransfer.files]
      files.forEach(file => {
        readImageFile(file)
          .then(({ base64, width, height }) => {
            const p = this.getSvgPoint(e)
            this.$svgif.elementType = 'rectangle'
            const elm = this.createElement({ ...p })
            elm.base64 = base64
            elm.defaultAspect = width / height
            // サイズはキャンバスに収める
            elm.width = Math.min(width, this.WHOLE_SIZE.width / 3)
            elm.height = elm.width / elm.defaultAspect
            elm.x -= elm.width / 2
            elm.y -= elm.height / 2
            this.createSvgElement([elm], true)
            this.selectElement(elm.id)
          })
          .catch(e => {
            this.$notify.error({
              title: 'Error',
              message: e.message
            })
          })
      })
    },
    startSelectFile() {
      this.$refs.fileInput.click()
    },
    moveCanvasSplitRateStart() {
      this.canvasSplitRatePast = this.$svgif.canvasSplitRate
    },
    moveCanvasSplitRate({ y }) {
      if (!this.$el || !this.$refs.canvas) return
      const wrapperRect = this.$el.getBoundingClientRect()
      const rate = y / wrapperRect.height
      this.$svgif.canvasSplitRate = Math.min(
        Math.max(this.canvasSplitRatePast + rate, 0.05),
        0.95
      )
    }
  }
}
</script>

<style lang="scss" scoped>
$split-handler-height: 0.8rem;

.clip-canvas {
  height: 100%;
  .canvas {
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
      outline-offset: -0.2rem;
      .svg-element-background {
        opacity: 0.3;
      }
      .svg-element {
        cursor: pointer;
      }
    }
  }
  .split-handler {
    height: $split-handler-height;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-top: 0.1rem solid gray;
    border-bottom: 0.1rem solid gray;
    &:hover {
      opacity: 0.8;
      background-color: #eee;
    }
    div {
      width: 4rem;
      height: 0.1rem;
      margin-top: 0.13rem;
      user-select: none;
      background-color: gray;
    }
  }
  .time-line {
    height: calc(100% - #{$split-handler-height});
  }
  .empty-board {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    .drop-text {
      font-size: 1.2rem;
      margin-top: 0.4rem;
    }
  }
}
</style>

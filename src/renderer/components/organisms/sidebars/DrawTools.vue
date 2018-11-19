<template>
  <div class="draw-tools" v-if="SELECTED_CLIP">
    <hr v-if="!$svgif.isWeb" />
    <div>
      <el-button-group>
        <el-button
          :type="$svgif.elementType === 'rectangle' && isDrawMode ? 'primary' : ''"
          size="mini"
          @click="setElementType('rectangle')"
        >
          <div class="button-content">
            <IconRectangle class="button-icon"/>
          </div>
        </el-button>
        <el-button
          :type="$svgif.elementType === 'circle' && isDrawMode ? 'primary' : ''"
          size="mini"
          @click="setElementType('circle')"
        >
          <div class="button-content">
            <IconCircle class="button-icon"/>
          </div>
        </el-button>
        <el-button
          :type="$svgif.elementType === 'text' && isDrawMode ? 'primary' : ''"
          size="mini"
          @click="setElementType('text')"
        >
          <div class="button-content">
            <IconText class="button-icon"/>
          </div>
        </el-button>
      </el-button-group>
      <el-button-group>
        <el-button
          :type="$svgif.elementType === 'line' && isDrawMode ? 'primary' : ''"
          size="mini"
          @click="setElementType('line')"
        >
          <div class="button-content">
            <IconLine class="button-icon"/>
          </div>
        </el-button>
        <el-button
          :type="$svgif.elementType === 'arrow' && isDrawMode ? 'primary' : ''"
          size="mini"
          @click="setElementType('arrow')"
        >
          <div class="button-content">
            <IconArrow class="button-icon"/>
          </div>
        </el-button>
      </el-button-group>
      <el-color-picker
        class="draw-color"
        :value="$svgif.elementColor"
        @input="setElementColor"
        show-alpha
        :predefine="predefineColors">
      </el-color-picker>
    </div>
    <el-button
      size="mini"
      icon="el-icon-picture"
      @click="selectPicture()"
    />
    <input
      v-show="false"
      ref="fileInput"
      multiple
      type="file"
      accept="image/*"
      @change="addPicture"
    />
    <el-button icon="el-icon-question" size="mini" circle @click="showHelpDialog = true" />
    <HelpDialog v-model="showHelpDialog" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@/store/modules/clips/types'
import { readImageFile } from '@/commons/utils/file'
import { createElement } from '@/commons/utils/element'
import IconRectangle from '@/components/atoms/icons/IconRectangle'
import IconCircle from '@/components/atoms/icons/IconCircle'
import IconLine from '@/components/atoms/icons/IconLine'
import IconArrow from '@/components/atoms/icons/IconArrow'
import IconText from '@/components/atoms/icons/IconText'
import HelpDialog from '@/components/organisms/dialogs/HelpDialog'

export default {
  components: {
    IconRectangle,
    IconCircle,
    IconLine,
    IconArrow,
    IconText,
    HelpDialog
  },
  data: () => ({
    predefineColors: [
      '#ff4500',
      '#ff8c00',
      '#ffd700',
      '#90ee90',
      '#00ced1',
      '#1e90ff',
      '#c71585',
      'rgba(255, 69, 0, 0.68)',
      'rgb(255, 120, 0)',
      'hsv(51, 100, 98)',
      'hsva(120, 40, 94, 0.5)',
      'hsl(181, 100%, 37%)',
      'hsla(209, 100%, 56%, 0.73)',
      '#c7158577'
    ],
    showHelpDialog: false
  }),
  computed: {
    ...mapGetters({
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE
    }),
    selectedElementList() {
      return this.$svgif.selectedElementIdList
        .map(id => this.SELECTED_CLIP.svgElementList.find(e => e.id === id))
        .filter(e => !!e)
    },
    isDrawMode() {
      return this.$svgif.canvasMode === 'draw'
    }
  },
  methods: {
    ...mapActions({
      _createSvgElement: clipTypes.a.CREATE_SVG_ELEMENT,
      _updateSvgElement: clipTypes.a.UPDATE_SVG_ELEMENT
    }),
    setCanvasMode(mode) {
      if (this.$svgif.canvasMode === mode) {
        this.$svgif.canvasMode = 'select'
      } else {
        this.$svgif.canvasMode = mode
      }
    },
    setElementType(type) {
      this.$svgif.elementType = type
      this.$svgif.canvasMode = 'draw'
    },
    setElementColor(val) {
      this.$svgif.elementColor = val
      this._updateSvgElement({
        clipId: this.SELECTED_CLIP.id,
        svgElementList: this.selectedElementList.map(elm => ({
          ...elm,
          stroke: val
        }))
      })
    },
    selectPicture() {
      this.$refs.fileInput.click()
    },
    addPicture(e) {
      const files = [...e.target.files]
      files.forEach(file => {
        readImageFile(file)
          .then(({ base64, width, height }) => {
            // キャンバス中心に追加する
            const elm = createElement({
              elementType: 'rectangle',
              elementColor: this.$svgif.elementColor,
              x: this.WHOLE_SIZE.width / 2,
              y: this.WHOLE_SIZE.height / 2
            })
            elm.base64 = base64
            elm.defaultAspect = width / height
            elm.width = Math.min(width, this.WHOLE_SIZE.width / 3)
            elm.height = elm.width / elm.defaultAspect
            elm.x -= elm.width / 2
            elm.y -= elm.height / 2
            this._createSvgElement({
              clipId: this.SELECTED_CLIP.id,
              svgElement: elm
            })
            this.$svgif.selectedElementIdList = [elm.id]
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
.draw-tools {
  padding: 0.4rem 0;
  overflow: auto;
  hr {
    height: 0.1rem;
    width: 80%;
    margin: 0 0 0.4rem 10%;
    background-color: rgba(gray, 0.5);
    border: 0;
  }
}
.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  .button-icon {
    height: 1.3rem;
    width: auto;
  }
}
.draw-color {
  vertical-align: middle;
}
</style>

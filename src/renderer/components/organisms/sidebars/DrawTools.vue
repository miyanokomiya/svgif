<template>
  <div class="draw-tools" v-if="SELECTED_CLIP">
    <el-button-group>
      <el-button
        icon="el-icon-news"
        :type="$svgif.canvasMode === 'select' ? 'primary' : ''"
        @click="setCanvasMode('select')"
      />
      <el-button
        disabled
        icon="el-icon-rank"
        :type="$svgif.canvasMode === 'move' ? 'primary' : ''"
      />
      <el-button
        icon="el-icon-edit"
        :type="$svgif.canvasMode === 'draw' ? 'primary' : ''"
        @click="setCanvasMode('draw')"
      />
    </el-button-group>
    <el-button-group>
      <el-button
        :type="$svgif.elementType === 'rectangle' ? 'primary' : ''"
        @click="setElementType('rectangle')"
      >
        Rect
      </el-button>
      <el-button
        :type="$svgif.elementType === 'circle' ? 'primary' : ''"
        @click="setElementType('circle')"
      >
        Circle
      </el-button>
      <el-button
        :type="$svgif.elementType === 'line' ? 'primary' : ''"
        @click="setElementType('line')"
      >
        LINE
      </el-button>
      <el-button
        :type="$svgif.elementType === 'arrow' ? 'primary' : ''"
        @click="setElementType('arrow')"
      >
        ARROW
      </el-button>
    </el-button-group>
    <el-color-picker
      :value="$svgif.elementColor"
      @input="setElementColor"
      show-alpha
      :predefine="predefineColors">
    </el-color-picker>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'

export default {
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
    ]
  }),
  computed: {
    ...mapGetters({
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP
    }),
    selectedElementList() {
      return this.$svgif.selectedElementIdList
        .map(id => this.SELECTED_CLIP.svgElementList.find(e => e.id === id))
        .filter(e => !!e)
    }
  },
  methods: {
    ...mapActions({
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
    }
  }
}
</script>

<style lang="scss" scoped>
.draw-tools {
  padding: 0.4rem 0;
}
</style>

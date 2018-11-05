<template>
  <div class="draw-tools">
    <el-button-group>
      <el-button
        icon="el-icon-news"
        :type="CANVAS_MODE === 'select' ? 'primary' : ''"
        @click="setCanvasMode('select')"
      />
      <el-button
        disabled
        icon="el-icon-rank"
        :type="CANVAS_MODE === 'move' ? 'primary' : ''"
      />
      <el-button
        icon="el-icon-edit"
        :type="CANVAS_MODE === 'draw' ? 'primary' : ''"
        @click="setCanvasMode('draw')"
      />
    </el-button-group>
    <el-button-group>
      <el-button
        :type="ELEMENT_TYPE === 'rectangle' ? 'primary' : ''"
        @click="setElementType('rectangle')"
      >
        Rect
      </el-button>
      <el-button
        :type="ELEMENT_TYPE === 'circle' ? 'primary' : ''"
        @click="setElementType('circle')"
      >
        Circle
      </el-button>
    </el-button-group>
    <el-color-picker
      :value="ELEMENT_COLOR"
      @input="_setElementColor"
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
      CANVAS_MODE: clipTypes.g.CANVAS_MODE,
      ELEMENT_TYPE: clipTypes.g.ELEMENT_TYPE,
      ELEMENT_COLOR: clipTypes.g.ELEMENT_COLOR
    })
  },
  methods: {
    ...mapActions({
      _setCanvasMode: clipTypes.a.SET_CANVAS_MODE,
      _setElementType: clipTypes.a.SET_ELEMENT_TYPE,
      _setElementColor: clipTypes.a.SET_ELEMENT_COLOR
    }),
    setCanvasMode(mode) {
      if (this.CANVAS_MODE === mode) {
        this._setCanvasMode('select')
      } else {
        this._setCanvasMode(mode)
      }
    },
    setElementType(type) {
      this._setElementType(type)
      this._setCanvasMode('draw')
    }
  }
}
</script>

<style lang="scss" scoped>
.draw-tools {
  padding: 0.4rem 0;
}
</style>

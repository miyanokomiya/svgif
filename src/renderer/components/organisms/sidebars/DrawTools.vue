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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'

export default {
  components: {},
  props: {},
  computed: {
    ...mapGetters({
      CANVAS_MODE: clipTypes.g.CANVAS_MODE,
      ELEMENT_TYPE: clipTypes.g.ELEMENT_TYPE
    })
  },
  methods: {
    ...mapActions({
      _setCanvasMode: clipTypes.a.SET_CANVAS_MODE,
      _setElementType: clipTypes.a.SET_ELEMENT_TYPE
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

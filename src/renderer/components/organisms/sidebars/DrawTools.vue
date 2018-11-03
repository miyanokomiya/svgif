<template>
  <div class="draw-tools">
    <el-button-group>
      <el-button
        :type="CANVAS_MODE === 'rectangle' ? 'primary' : ''"
        @click="setCanvasMode('rectangle')"
      >
        Rect
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
      CANVAS_MODE: clipTypes.g.CANVAS_MODE
    })
  },
  methods: {
    ...mapActions({
      _setCanvasMode: clipTypes.a.SET_CANVAS_MODE
    }),
    setCanvasMode(mode) {
      if (this.CANVAS_MODE === mode) {
        this._setCanvasMode('select')
      } else {
        this._setCanvasMode(mode)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.draw-tools {
  padding: 0.4rem 0;
}
</style>

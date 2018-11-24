<template>
  <div class="canvas-footer" v-if="SELECTED_CLIP">
    <el-button
      v-if="!$svgif.isWeb"
      icon="el-icon-picture"
      size="mini"
      @click="$emit('showRecorderWindow')"
    >
      Capture
    </el-button>
    <div class="total-delay"><span>Frame(ms): </span><span class="current-time">{{trimNumber(CURRENT_TIME)}}</span><span>/ {{trimNumber(WHOLE_DELAY)}}</span></div>
    <el-button
      type="primary"
      size="mini"
      icon="el-icon-picture-outline"
      class="create-gif-button"
      @click="createGif"
    >
      Create Gif
    </el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import clipTypes from '@/store/modules/clips/types'

export default {
  computed: {
    ...mapGetters({
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_DELAY: clipTypes.g.WHOLE_DELAY,
      CURRENT_TIME: clipTypes.g.CURRENT_TIME
    })
  },
  methods: {
    trimNumber(num) {
      return Math.floor(num)
    },
    createGif() {
      this.$emit('createGif')
    }
  }
}
</script>

<style lang="scss" scoped>
.canvas-footer {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: 100%;
  background-color: #b3c0d1;
  color: #333;
  > * {
    margin-left: 1rem;
    &:first-child {
      margin-left: 0;
    }
  }
  .total-delay {
    display: flex;
    margin-left: auto;
    .current-time {
      min-width: 8rem;
      text-align: right;
      margin-right: 0.6rem;
    }
  }
}
</style>

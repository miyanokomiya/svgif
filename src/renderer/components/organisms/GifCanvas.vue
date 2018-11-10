<template>
  <div class="clip-canvas">
    <ImagePanel :src="gif"/>
  </div>
</template>

<script>
import ImagePanel from '@/components/atoms/ImagePanel'

export default {
  components: {
    ImagePanel
  },
  props: {
    gif: {
      type: String,
      default: ''
    },
    clipList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.clip-canvas {
  height: 100%;
}
</style>

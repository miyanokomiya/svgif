<template>
  <div v-if="clip" class="clip-canvas">
    <ImagePanel :src="clip.base64" />
  </div>
</template>

<script>
import ImagePanel from '@/components/atoms/ImagePanel'

export default {
  components: {
    ImagePanel
  },
  props: {
    clip: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.clip-canvas {
  height: 100%;
}
</style>

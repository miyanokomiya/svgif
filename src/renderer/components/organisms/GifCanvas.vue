<template>
  <div class="clip-canvas">
    <ImagePanel
      :src="gif"
      :width="WHOLE_SIZE.width"
      :height="WHOLE_SIZE.height"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'
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
  },
  computed: {
    ...mapGetters({
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE
    })
  }
}
</script>

<style lang="scss" scoped>
.clip-canvas {
  height: 100%;
}
</style>

<template>
  <div class="clip-canvas" ref="wrapper">
    <ImagePanel
      :src="gif"
      :width="imageSize.width"
      :height="imageSize.height"
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
  data: () => ({
    scale: 1
  }),
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
    }),
    imageSize() {
      return {
        width: this.WHOLE_SIZE.width * this.scale,
        height: this.WHOLE_SIZE.height * this.scale
      }
    },
    windowInfo() {
      return this.$svgif.windowInfo
    }
  },
  mounted() {
    this.rescale()
  },
  watch: {
    windowInfo() {
      this.rescale()
    },
    gif() {
      this.rescale()
    }
  },
  methods: {
    rescale() {
      this.$nextTick(() => {
        if (!this.$refs.wrapper) return
        const wrapperRect = this.$refs.wrapper.getBoundingClientRect()
        const wRate = wrapperRect.width / this.WHOLE_SIZE.width
        const hRate = wrapperRect.height / this.WHOLE_SIZE.height
        const rate = Math.min(wRate, hRate)
        // 小さすぎるスケールは避ける
        this.scale = Math.max(Math.min(rate, 1), 0.00001)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.clip-canvas {
  height: 100%;
}
</style>

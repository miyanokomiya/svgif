<template>
  <div v-if="SELECTED_CLIP" class="clip-canvas">
    <div class="canvas" ref="wrapper">
      <ImagePanel
        :src="SELECTED_CLIP.base64"
        :width="imageSize.width"
        :height="imageSize.height"
      />
      <SvgCanvas
        :width="WHOLE_SIZE.width * scale"
        :height="WHOLE_SIZE.height * scale"
      >
        <SvgRectangle
          :x="100"
          :y="100"
          :width="100"
          :height="100"
        />
      </SvgCanvas>
    </div>
    <ClipTimeLine class="time-line" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'
import ImagePanel from '@/components/atoms/ImagePanel'
import SvgCanvas from '@/components/molecules/SvgCanvas'
import SvgRectangle from '@/components/atoms/SvgRectangle'
import ClipTimeLine from '@/components/organisms/ClipTimeLine'

export default {
  components: {
    ImagePanel,
    SvgCanvas,
    SvgRectangle,
    ClipTimeLine
  },
  data: () => ({
    scale: 1
  }),
  computed: {
    ...mapGetters({
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE
    }),
    imageSize() {
      const wRate = this.WHOLE_SIZE.width / this.SELECTED_CLIP.width
      const hRate = this.WHOLE_SIZE.height / this.SELECTED_CLIP.height
      const rate = Math.min(Math.min(wRate, hRate), 1)
      return {
        width: this.SELECTED_CLIP.width * this.scale * rate,
        height: this.SELECTED_CLIP.height * this.scale * rate
      }
    }
  },
  mounted() {
    this.rescale()
  },
  updated() {
    this.rescale()
  },
  methods: {
    rescale() {
      this.$nextTick(() => {
        if (!this.$refs.wrapper) return
        const wrapperRect = this.$refs.wrapper.getBoundingClientRect()
        const wRate = wrapperRect.width / this.WHOLE_SIZE.width
        const hRate = wrapperRect.height / this.WHOLE_SIZE.height
        const rate = Math.min(wRate, hRate)
        this.scale = Math.min(rate, 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.clip-canvas {
  height: 100%;
  .canvas {
    height: calc(100% - 8rem);
    position: relative;
    svg {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      border: 0.1rem solid black;
    }
  }
}
</style>

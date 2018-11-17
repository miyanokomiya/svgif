<template>
  <SvgCanvas :height="40" :width="60" class="svg-icon">
    <SvgArrow
      :x1="strokeWidth/2"
      :y1="strokeWidth/2"
      :x2="strokeWidth/2 + width"
      :y2="strokeWidth/2 + height"
      :width="width"
      :height="height"
      :radius2="width / 4"
      :depth2="width / 2"
      :stroke="$svgif.elementColor"
      :strokeWidth="strokeWidth"
    />
  </SvgCanvas>
</template>

<script>
import SvgArrow from '@/components/atoms/SvgArrow'
import SvgCanvas from '@/components/molecules/SvgCanvas'

export default {
  components: {
    SvgArrow,
    SvgCanvas
  },
  computed: {
    strokeWidth() {
      return 8
    },
    width() {
      return 60 - this.strokeWidth
    },
    height() {
      return 40 - this.strokeWidth
    }
  }
}
</script>

<style>
.svg-icon {
  display: inline;
}
</style>

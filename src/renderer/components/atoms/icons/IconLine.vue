<template>
  <SvgCanvas :height="40" :width="60" class="svg-icon">
    <SvgLine
      :x1="strokeWidth/2"
      :y1="strokeWidth/2"
      :x2="strokeWidth/2 + width"
      :y2="strokeWidth/2 + height"
      :width="width"
      :height="height"
      :stroke="$svgif.elementColor"
      :strokeWidth="strokeWidth"
    />
  </SvgCanvas>
</template>

<script>
import SvgLine from '@/components/atoms/SvgLine'
import SvgCanvas from '@/components/molecules/SvgCanvas'

export default {
  components: {
    SvgLine,
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

<template>
  <SvgCanvas :height="40" :width="60" class="svg-icon">
    <SvgRectangle
      :x="strokeWidth/2"
      :y="strokeWidth/2"
      :width="width"
      :height="height"
      :stroke="$svgif.elementColor"
      :strokeWidth="strokeWidth"
    />
  </SvgCanvas>
</template>

<script>
import SvgRectangle from '@/components/atoms/SvgRectangle'
import SvgCanvas from '@/components/molecules/SvgCanvas'

export default {
  components: {
    SvgRectangle,
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

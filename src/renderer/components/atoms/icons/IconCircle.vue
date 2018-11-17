<template>
  <SvgCanvas :height="40" :width="60" class="svg-icon">
    <SvgCircle
      :cx="rx + strokeWidth / 2"
      :cy="ry + strokeWidth / 2"
      :rx="rx"
      :ry="ry"
      :stroke="$svgif.elementColor"
      :strokeWidth="strokeWidth"
    />
  </SvgCanvas>
</template>

<script>
import SvgCircle from '@/components/atoms/SvgCircle'
import SvgCanvas from '@/components/molecules/SvgCanvas'

export default {
  components: {
    SvgCircle,
    SvgCanvas
  },
  computed: {
    strokeWidth() {
      return 8
    },
    rx() {
      return (60 - this.strokeWidth) / 2
    },
    ry() {
      return (40 - this.strokeWidth) / 2
    }
  }
}
</script>

<style>
.svg-icon {
  display: inline;
}
</style>

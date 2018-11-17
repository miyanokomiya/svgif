<template>
  <SvgCanvas :height="40" :width="60" class="svg-icon">
    <SvgText
      text="Aa"
      :x="6"
      :y="34"
      :fontSize="40"
      :stroke="$svgif.elementColor"
      :fill="$svgif.elementColor"
    />
  </SvgCanvas>
</template>

<script>
import SvgText from '@/components/atoms/SvgText'
import SvgCanvas from '@/components/molecules/SvgCanvas'

export default {
  components: {
    SvgText,
    SvgCanvas
  }
}
</script>

<style>
.svg-icon {
  display: inline;
}
</style>

<template>
<g>
  <SvgCircle
    :cx="cx"
    :cy="cy"
    :r="radius"
    stroke="black"
    fill="white"
  />
  <path
    :d="`M ${cx - radius / 2} ${cy - radius / 2} l ${radius} ${radius} m 0 ${-radius} l ${-radius} ${radius}`"
    stroke="black"
    :stroke-width="htmlToSvg(2)"
    :transform="rotate"
  />
</g>
</template>

<script>
import scaleConverter from '@/commons/mixins/scaleConverter'
import SvgCircle from '@/components/atoms/SvgCircle'

export default {
  mixins: [scaleConverter],
  components: {
    SvgCircle
  },
  props: {
    cx: {
      type: Number,
      default: 0
    },
    cy: {
      type: Number,
      default: 0
    },
    scale: {
      type: Number,
      default: 1
    },
    radian: {
      type: Number,
      default: 0
    }
  },
  computed: {
    rotate() {
      return `rotate(${(this.radian * 180) / Math.PI}, ${this.cx}, ${this.cy})`
    },
    radius() {
      return this.htmlToSvg(7)
    }
  }
}
</script>

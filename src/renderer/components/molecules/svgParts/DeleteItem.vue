<template>
<g>
  <SvgCircle
    :cx="cx"
    :cy="cy"
    :r="htmlToSvg(10)"
    stroke="black"
    fill="white"
  />
  <path
    :d="`M ${cx - htmlToSvg(5)} ${cy - htmlToSvg(5)} l ${htmlToSvg(10)} ${htmlToSvg(10)} m 0 ${htmlToSvg(-10)} l ${htmlToSvg(-10)} ${htmlToSvg(10)}`"
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
    }
  }
}
</script>

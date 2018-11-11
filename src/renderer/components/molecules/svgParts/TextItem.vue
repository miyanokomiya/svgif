<template>
<g :transform="rotate">
  <SvgCircle
    :cx="cx"
    :cy="cy"
    :r="htmlToSvg(7)"
    stroke="black"
    fill="white"
  />
  <SvgText
    :x="cx"
    :y="cy"
    text="A"
    :font-size="htmlToSvg(12)"
    text-anchor="middle"
    dominant-baseline="central"
  />
</g>
</template>

<script>
import scaleConverter from '@/commons/mixins/scaleConverter'
import SvgCircle from '@/components/atoms/SvgCircle'
import SvgText from '@/components/atoms/SvgText'

export default {
  mixins: [scaleConverter],
  components: {
    SvgCircle,
    SvgText
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

<template>
  <g>
    <template v-if="rect">
      <SvgRectangle
        v-if="selected"
        :x="rect.x"
        :y="rect.y"
        :width="rect.width"
        :height="rect.height"
        stroke="lime"
        :strokeOpacity="0.7"
        :strokeWidth="rect.strokeWidth + htmlToSvg(10)"
      />
      <SvgRectangle
        :x="rect.x"
        :y="rect.y"
        :width="rect.width"
        :height="rect.height"
        :stroke="rect.stroke"
        :strokeWidth="rect.strokeWidth"
      />
      <SvgCircle
        :cx="rect.x - htmlToSvg(7)"
        :cy="rect.y - htmlToSvg(7)"
        :r="htmlToSvg(10)"
        stroke="black"
        fill="white"
      />
    </template>
  </g>
</template>

<script>
import SvgRectangle from '@/components/atoms/SvgRectangle'
import SvgCircle from '@/components/atoms/SvgCircle'

export default {
  components: {
    SvgRectangle,
    SvgCircle
  },
  props: {
    svgElement: {
      type: Object,
      required: true
    },
    moveVec: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    },
    selected: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1
    }
  },
  computed: {
    rect() {
      if (this.svgElement.name !== 'rect') return null
      return {
        ...this.svgElement,
        x: this.svgElement.x + this.moveVec.x,
        y: this.svgElement.y + this.moveVec.y
      }
    }
  },
  methods: {
    htmlToSvg(val) {
      return val / this.scale
    },
    svgToHtml(val) {
      return val * this.scale
    }
  }
}
</script>

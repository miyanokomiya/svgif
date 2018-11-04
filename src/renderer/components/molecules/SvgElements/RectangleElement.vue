<template>
  <g>
    <g @mousedown="$emit('startMove', rect.id)">
      <SvgRectangle
        v-if="selected"
        :x="rect.x"
        :y="rect.y"
        :width="rect.width"
        :height="rect.height"
        stroke="lime"
        :strokeOpacity="0.7"
        :strokeWidth="rect.strokeWidth + htmlToSvg(5)"
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
        :cx="rect.x"
        :cy="rect.y"
        :r="htmlToSvg(7)"
        stroke="black"
        fill="white"
      />
    </g>
    <template v-if="selected">
      <g @mousedown="$emit('deleteElement', rect.id)">
        <SvgCircle
          :cx="rect.x"
          :cy="rect.y + rect.height"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
        />
        <path
          :d="`M ${rect.x - htmlToSvg(5)} ${rect.y + rect.height - htmlToSvg(5)} l ${htmlToSvg(10)} ${htmlToSvg(10)} m 0 ${htmlToSvg(-10)} l ${htmlToSvg(-10)} ${htmlToSvg(10)}`"
          stroke="black"
          :stroke-width="htmlToSvg(2)"
        />
      </g>
      <g @mousedown="$emit('startResize', rect.id)">
        <SvgCircle
          :cx="rect.x + rect.width"
          :cy="rect.y + rect.height"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
        />
        <path
          :d="`M ${rect.x + rect.width + htmlToSvg(5)} ${rect.y + rect.height - htmlToSvg(5)} v ${htmlToSvg(10)} h ${htmlToSvg(-10)} z`"
          stroke="black"
        />
      </g>
    </template>
  </g>
</template>

<script>
import scaleConverter from '@/commons/mixins/scaleConverter'
import SvgRectangle from '@/components/atoms/SvgRectangle'
import SvgCircle from '@/components/atoms/SvgCircle'

export default {
  mixins: [scaleConverter],
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
      return {
        ...this.svgElement,
        x: this.svgElement.x + this.moveVec.x,
        y: this.svgElement.y + this.moveVec.y
      }
    }
  }
}
</script>

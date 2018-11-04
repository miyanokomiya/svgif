<template>
  <g>
    <g @mousedown="$emit('startMove', circle.id)">
      <SvgCircle
        v-if="selected && !plain"
        :cx="cx"
        :cy="cy"
        :rx="rx"
        :ry="ry"
        :stroke="selectedStroke"
        :strokeOpacity="selectedStrokeOpacity"
        :strokeWidth="selectedStrokeWidth"
      />
      <SvgCircle
        :cx="cx"
        :cy="cy"
        :rx="rx"
        :ry="ry"
        :stroke="circle.stroke"
        :strokeWidth="circle.strokeWidth"
      />
      <SvgCircle
        v-if="!plain"
        :cx="circle.x"
        :cy="circle.y"
        :r="htmlToSvg(7)"
        stroke="black"
        fill="white"
      />
    </g>
    <template v-if="selected && !plain">
      <g @mousedown="$emit('deleteElement', circle.id)">
        <SvgCircle
          :cx="circle.x"
          :cy="circle.y + circle.height"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
        />
        <path
          :d="`M ${circle.x - htmlToSvg(5)} ${circle.y + circle.height - htmlToSvg(5)} l ${htmlToSvg(10)} ${htmlToSvg(10)} m 0 ${htmlToSvg(-10)} l ${htmlToSvg(-10)} ${htmlToSvg(10)}`"
          stroke="black"
          :stroke-width="htmlToSvg(2)"
        />
      </g>
      <g @mousedown="$emit('startResize', circle.id)">
        <SvgCircle
          :cx="circle.x + circle.width"
          :cy="circle.y + circle.height"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
        />
        <path
          :d="`M ${circle.x + circle.width + htmlToSvg(5)} ${circle.y + circle.height - htmlToSvg(5)} v ${htmlToSvg(10)} h ${htmlToSvg(-10)} z`"
          stroke="black"
        />
      </g>
    </template>
  </g>
</template>

<script>
import BaseElement from './BaseElement'
import SvgRectangle from '@/components/atoms/SvgRectangle'
import SvgCircle from '@/components/atoms/SvgCircle'

export default {
  extends: BaseElement,
  components: {
    SvgRectangle,
    SvgCircle
  },
  computed: {
    circle() {
      return {
        ...this.svgElement,
        x: this.svgElement.x + this.moveVec.x,
        y: this.svgElement.y + this.moveVec.y
      }
    },
    cx() {
      return this.circle.x + this.rx
    },
    cy() {
      return this.circle.y + this.ry
    },
    rx() {
      return this.circle.width / 2
    },
    ry() {
      return this.circle.height / 2
    }
  }
}
</script>

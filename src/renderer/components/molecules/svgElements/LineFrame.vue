<template>
  <g>
    <g @mousedown="$emit('startMove', svgElement.id)">
      <slot/>
    </g>
    <template v-if="selected && !plain">
      <g @mousedown="$emit('startResizeLine1', svgElement.id)">
        <SvgCircle
          :cx="svgElement.x1"
          :cy="svgElement.y1"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
        />
      </g>
      <g @mousedown="$emit('startResizeLine2', svgElement.id)">
        <SvgCircle
          :cx="svgElement.x2"
          :cy="svgElement.y2"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
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
  props: {
    svgElement: {
      type: Object,
      required: true
    }
  }
}
</script>

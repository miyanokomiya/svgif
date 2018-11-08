<template>
  <g>
    <g @mousedown="$emit('startMove', svgElement.id)">
      <slot/>
    </g>
    <template v-if="selected && !plain">
      <g @mousedown="$emit('startResizeWidth', svgElement.id)">
        <path
          :d="`M ${center.x} ${center.y} L ${resizeItem.x} ${resizeItem.y}`"
          stroke="black"
          :stroke-width="htmlToSvg(1)"
          :stroke-dasharray="`${htmlToSvg(1)}, ${htmlToSvg(5)}`"
          fill="none"
        />
        <SvgCircle
          :cx="resizeItem.x"
          :cy="resizeItem.y"
          :r="htmlToSvg(7)"
          stroke="black"
          fill="white"
        />
        <path
          :d="`M ${resizeItem.x - htmlToSvg(5)} ${resizeItem.y} h ${htmlToSvg(10)}`"
          stroke="black"
          :stroke-width="htmlToSvg(3)"
          :transform="rotate"
        />
      </g>
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
import * as geo from '@/commons/utils/geo'

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
  },
  computed: {
    from() {
      return {
        x: this.svgElement.x1,
        y: this.svgElement.y1
      }
    },
    to() {
      return {
        x: this.svgElement.x2,
        y: this.svgElement.y2
      }
    },
    center() {
      return geo.center(this.from, this.to)
    },
    radian() {
      return geo.getRadian(this.from, this.to)
    },
    resizeItem() {
      const vec = geo.unitVector(this.from, this.to)
      const cross = geo.crossVector(vec)
      const d = this.htmlToSvg(15) + this.svgElement.strokeWidth / 2
      return {
        x: this.center.x + cross.x * d,
        y: this.center.y + cross.y * d
      }
    },
    rotate() {
      return `rotate(${(this.radian * 180) / Math.PI}, ${this.resizeItem.x}, ${
        this.resizeItem.y
      })`
    }
  }
}
</script>

<template>
<RectangleFrame
  :svgElement="rect"
  :scale="scale"
  :selected="selected"
  :plain="plain"
  @startMove="$emit('startMove', rect.id)"
  @startResize="$emit('startResize', rect.id)"
  @deleteElement="$emit('deleteElement', rect.id)"
  @startResizeWidth="$emit('startResizeWidth', rect.id)"
>
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
    :stroke="rect.stroke"
    :strokeWidth="rect.strokeWidth"
  />
</RectangleFrame>
</template>

<script>
import BaseElement from './BaseElement'
import SvgCircle from '@/components/atoms/SvgCircle'
import RectangleFrame from './RectangleFrame'

export default {
  extends: BaseElement,
  components: {
    SvgCircle,
    RectangleFrame
  },
  computed: {
    rect() {
      return {
        ...this.svgElement,
        x: this.svgElement.x + this.moveVec.x,
        y: this.svgElement.y + this.moveVec.y
      }
    },
    cx() {
      return this.rect.x + this.rx
    },
    cy() {
      return this.rect.y + this.ry
    },
    rx() {
      return this.rect.width / 2
    },
    ry() {
      return this.rect.height / 2
    }
  }
}
</script>

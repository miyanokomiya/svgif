<template>
<LineFrame
  :svgElement="line"
  :scale="scale"
  :selected="selected"
  :plain="plain"
  @startMove="$emit('startMove', line.id)"
  @deleteElement="$emit('deleteElement', line.id)"
  @startResizeWidth="$emit('startResizeWidth', line.id)"
  @startRotate="$emit('startRotate', line.id)"
  @startResizeLine1="$emit('startResizeLine1', line.id)"
  @startResizeLine2="$emit('startResizeLine2', line.id)"
>
  <SvgArrow
    v-if="selected && !plain"
    :x1="line.x1"
    :y1="line.y1"
    :x2="line.x2"
    :y2="line.y2"
    :radius2="line.radius2"
    :depth2="line.depth2"
    :stroke="selectedStroke"
    :strokeOpacity="selectedStrokeOpacity"
    :strokeWidth="selectedStrokeWidth"
  />
  <SvgArrow
    :x1="line.x1"
    :y1="line.y1"
    :x2="line.x2"
    :y2="line.y2"
    :radius2="line.radius2"
    :depth2="line.depth2"
    :stroke="line.stroke"
    :strokeWidth="line.strokeWidth"
  />
</LineFrame>
</template>

<script>
import BaseElement from './BaseElement'
import SvgArrow from '@/components/atoms/SvgArrow'
import LineFrame from './LineFrame'

export default {
  extends: BaseElement,
  components: {
    SvgArrow,
    LineFrame
  },
  computed: {
    line() {
      return {
        ...this.svgElement,
        x1: this.svgElement.x1 + this.moveVec.x,
        y1: this.svgElement.y1 + this.moveVec.y,
        x2: this.svgElement.x2 + this.moveVec.x,
        y2: this.svgElement.y2 + this.moveVec.y
      }
    }
  }
}
</script>

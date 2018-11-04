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
  <SvgRectangle
    v-if="selected && !plain"
    :x="rect.x"
    :y="rect.y"
    :width="rect.width"
    :height="rect.height"
    :stroke="selectedStroke"
    :strokeOpacity="selectedStrokeOpacity"
    :strokeWidth="selectedStrokeWidth"
  />
  <SvgRectangle
    :x="rect.x"
    :y="rect.y"
    :width="rect.width"
    :height="rect.height"
    :stroke="rect.stroke"
    :strokeWidth="rect.strokeWidth"
  />
</RectangleFrame>
</template>

<script>
import BaseElement from './BaseElement'
import SvgRectangle from '@/components/atoms/SvgRectangle'
import RectangleFrame from './RectangleFrame'

export default {
  extends: BaseElement,
  components: {
    SvgRectangle,
    RectangleFrame
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

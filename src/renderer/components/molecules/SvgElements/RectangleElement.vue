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
  @startRotate="$emit('startRotate', rect.id)"
>
  <SvgRectangle
    v-if="selected && !plain"
    :width="rect.width"
    :height="rect.height"
    :stroke="selectedStroke"
    :strokeOpacity="selectedStrokeOpacity"
    :strokeWidth="selectedStrokeWidth"
  />
  <SvgRectangle
    :width="rect.width"
    :height="rect.height"
    :stroke="rect.stroke"
    :strokeWidth="rect.strokeWidth"
  />
  <image 
    v-if="svgElement.base64"
    :x="imageRect.x"
    :y="imageRect.y"
    :width="imageRect.width"
    :height="imageRect.height"
    :xlink:href="svgElement.base64"
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
    },
    imageRect() {
      // <image>は負のサイズに未対応なので調整
      return {
        x: this.rect.width > 0 ? 0 : this.rect.width,
        y: this.rect.height > 0 ? 0 : this.rect.height,
        width: Math.abs(this.rect.width),
        height: Math.abs(this.rect.height)
      }
    }
  }
}
</script>

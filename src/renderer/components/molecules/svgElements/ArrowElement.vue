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
  <g slot="edit">
    <!-- <OptionPath :d="`M ${center.x} ${center.y} L ${resizeItem.x} ${resizeItem.y}`" /> -->
    <ResizeItem
      :scale="scale"
      :cx="resizeArrowItem2.x"
      :cy="resizeArrowItem2.y"
      :radian="radian + Math.PI"
      @mousedown.native="$emit('startResizeArrow2', line.id)"
    />
  </g>
</LineFrame>
</template>

<script>
import BaseElement from './BaseElement'
import SvgArrow from '@/components/atoms/SvgArrow'
import LineFrame from './LineFrame'
import ResizeWidthItem from '@/components/molecules/svgParts/ResizeWidthItem'
import ResizeItem from '@/components/molecules/svgParts/ResizeItem'
import * as geo from '@/commons/utils/geo'

export default {
  extends: BaseElement,
  components: {
    SvgArrow,
    LineFrame,
    ResizeWidthItem,
    ResizeItem
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
    },
    from() {
      return {
        x: this.line.x1,
        y: this.line.y1
      }
    },
    to() {
      return {
        x: this.line.x2,
        y: this.line.y2
      }
    },
    radian() {
      return geo.getRadian(this.from, this.to)
    },
    unitCross() {
      return geo.crossVector(this.unitVector)
    },
    unitVector() {
      return geo.unitVector(this.from, this.to)
    },
    resizeArrowItem2() {
      return {
        x:
          this.line.x2 -
          this.unitVector.x * this.line.depth2 +
          this.unitCross.x * (this.line.radius2 + this.line.strokeWidth / 2),
        y:
          this.line.y2 -
          this.unitVector.y * this.line.depth2 +
          this.unitCross.y * (this.line.radius2 + this.line.strokeWidth / 2)
      }
    }
  }
}
</script>

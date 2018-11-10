<template>
  <g>
    <g @mousedown="$emit('startMove', svgElement.id)">
      <slot/>
    </g>
    <template v-if="selected && !plain">
      <g @mousedown="$emit('startResizeWidth', svgElement.id)">
        <OptionPath :d="`M ${center.x} ${center.y} L ${resizeItem.x} ${resizeItem.y}`" />
        <SvgCircle
          :cx="resizeItem.x"
          :cy="resizeItem.y"
          :r="htmlToSvg(7)"
          stroke="black"
          fill="white"
        />
        <ResizeWidthItem :scale="scale" :cx="resizeItem.x" :cy="resizeItem.y" :radian="radian" />
      </g>
      <g @mousedown="$emit('startResizeLine1', svgElement.id)">
        <OptionPath :d="`M ${svgElement.x1} ${svgElement.y1} L ${moveItem1.x} ${moveItem1.y}`" />
        <SvgCircle
          :cx="moveItem1.x"
          :cy="moveItem1.y"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
        />
      </g>
      <g @mousedown="$emit('startResizeLine2', svgElement.id)">
        <OptionPath :d="`M ${svgElement.x2} ${svgElement.y2} L ${moveItem2.x} ${moveItem2.y}`" />
        <SvgCircle
          :cx="moveItem2.x"
          :cy="moveItem2.y"
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
import ResizeWidthItem from '@/components/molecules/svgParts/ResizeWidthItem'
import OptionPath from '@/components/molecules/svgParts/OptionPath'
import * as geo from '@/commons/utils/geo'
import * as elementUtils from '@/commons/utils/element'

export default {
  extends: BaseElement,
  components: {
    SvgRectangle,
    SvgCircle,
    ResizeWidthItem,
    OptionPath
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
      const cross = geo.crossVector(geo.unitVector(this.from, this.to))
      const d = this.htmlToSvg(15) + this.svgElement.strokeWidth / 2
      return {
        x: this.center.x + cross.x * d,
        y: this.center.y + cross.y * d
      }
    },
    moveLineItemDiffVector() {
      return elementUtils.moveLineItemDiffVector({
        element: this.svgElement,
        scale: this.scale
      })
    },
    moveItem1() {
      return {
        x: this.svgElement.x1 - this.moveLineItemDiffVector.x,
        y: this.svgElement.y1 - this.moveLineItemDiffVector.y
      }
    },
    moveItem2() {
      return {
        x: this.svgElement.x2 + this.moveLineItemDiffVector.x,
        y: this.svgElement.y2 + this.moveLineItemDiffVector.y
      }
    }
  }
}
</script>

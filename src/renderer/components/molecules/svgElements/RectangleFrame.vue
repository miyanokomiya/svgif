<template>
  <g :transform="transform">
    <g @mousedown="$emit('startMove', svgElement.id)">
      <slot/>
    </g>
    <g v-if="!plain">
      <OptionPath :d="`M ${-svgElement.strokeWidth / 2} ${svgElement.height / 2 - svgElement.strokeWidth / 2} v ${-svgElement.height / 2} h ${svgElement.width / 2}`" />
      <MoveItem
        :scale="scale"
        :cx="-svgElement.strokeWidth / 2"
        :cy="-svgElement.strokeWidth / 2"
        @mousedown.native="$emit('startMove', svgElement.id)"
      />
    </g>
    <template v-if="selected && !plain">
      <OptionPath :d="`M ${-svgElement.strokeWidth / 2} ${svgElement.height / 2 + svgElement.strokeWidth / 2} v ${svgElement.height / 2} h ${svgElement.width / 2}`" />
      <DeleteItem
        :scale="scale"
        :cx="-svgElement.strokeWidth / 2"
        :cy="svgElement.height + svgElement.strokeWidth / 2"
        @mousedown.native="$emit('deleteElement', svgElement.id)"
      />
      <OptionPath :d="`M ${svgElement.width + svgElement.strokeWidth / 2} ${svgElement.height / 2 + svgElement.strokeWidth / 2} v ${svgElement.height / 2} h ${-svgElement.width / 2}`" />
      <g @mousedown="$emit('startResize', svgElement.id)">
        <SvgCircle
          :cx="svgElement.width + svgElement.strokeWidth / 2"
          :cy="svgElement.height + svgElement.strokeWidth / 2"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
        />
        <path
          :d="`M ${svgElement.width + svgElement.strokeWidth / 2 + htmlToSvg(5)} ${svgElement.height + svgElement.strokeWidth / 2 - htmlToSvg(5)} v ${htmlToSvg(10)} h ${htmlToSvg(-10)} z`"
          stroke="black"
        />
      </g>
      <OptionPath :d="`M ${svgElement.width / 2} ${svgElement.height} v ${htmlToSvg(15) + svgElement.strokeWidth / 2}`" />
      <ResizeWidthItem
        :scale="scale"
        :cx="svgElement.width / 2"
        :cy="svgElement.height + htmlToSvg(15) + svgElement.strokeWidth / 2"
        @mousedown.native="$emit('startResizeWidth', svgElement.id)"
      />
      <g @mousedown="$emit('startRotate', svgElement.id)">
        <OptionPath :d="`M ${svgElement.width / 2} ${0} v -${htmlToSvg(15) + svgElement.strokeWidth / 2}`" />
        <SvgCircle
          :cx="svgElement.width / 2"
          :cy="-(htmlToSvg(15) + svgElement.strokeWidth / 2)"
          :r="htmlToSvg(7)"
          stroke="black"
          fill="white"
        />
        <SvgCircle
          :cx="svgElement.width / 2"
          :cy="-(htmlToSvg(15) + svgElement.strokeWidth / 2)"
          :r="htmlToSvg(3)"
          stroke="black"
          :stroke-width="htmlToSvg(2)"
          fill="none"
        />
      </g>
    </template>
  </g>
</template>

<script>
import BaseElement from './BaseElement'
import SvgCircle from '@/components/atoms/SvgCircle'
import ResizeWidthItem from '@/components/molecules/svgParts/ResizeWidthItem'
import DeleteItem from '@/components/molecules/svgParts/DeleteItem'
import MoveItem from '@/components/molecules/svgParts/MoveItem'
import OptionPath from '@/components/molecules/svgParts/OptionPath'

export default {
  extends: BaseElement,
  components: {
    SvgCircle,
    ResizeWidthItem,
    DeleteItem,
    MoveItem,
    OptionPath
  },
  props: {
    svgElement: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0,
        width: 1,
        height: 1
      })
    }
  },
  computed: {
    transform() {
      return `translate(${this.svgElement.x},${this.svgElement.y})rotate(${(this
        .svgElement.radian /
        Math.PI) *
        180}, ${this.svgElement.width / 2}, ${this.svgElement.height / 2})`
    }
  }
}
</script>

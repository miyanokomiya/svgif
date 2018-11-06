<template>
  <g>
    <g @mousedown="$emit('startMove', svgElement.id)">
      <slot/>
    </g>
    <path
      :d="`M ${svgElement.x - svgElement.strokeWidth / 2} ${svgElement.y + svgElement.height / 2 - svgElement.strokeWidth / 2} v ${-svgElement.height / 2} h ${svgElement.width / 2}`"
      stroke="black"
      :stroke-width="htmlToSvg(1)"
      :stroke-dasharray="`${htmlToSvg(1)}, ${htmlToSvg(5)}`"
      fill="none"
    />
    <g @mousedown="$emit('startMove', svgElement.id)">
      <SvgCircle
        v-if="!plain"
        :cx="svgElement.x - svgElement.strokeWidth / 2"
        :cy="svgElement.y - svgElement.strokeWidth / 2"
        :r="htmlToSvg(7)"
        stroke="black"
        :fill="selected ? selectedStroke : 'white'"
      />
    </g>
    <template v-if="selected && !plain">
      <path
        :d="`M ${svgElement.x - svgElement.strokeWidth / 2} ${svgElement.y + svgElement.height / 2 + svgElement.strokeWidth / 2} v ${svgElement.height / 2} h ${svgElement.width / 2}`"
        stroke="black"
        :stroke-width="htmlToSvg(1)"
        :stroke-dasharray="`${htmlToSvg(1)}, ${htmlToSvg(5)}`"
        fill="none"
      />
      <g @mousedown="$emit('deleteElement', svgElement.id)">
        <SvgCircle
          :cx="svgElement.x - svgElement.strokeWidth / 2"
          :cy="svgElement.y + svgElement.height + svgElement.strokeWidth / 2"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
        />
        <path
          :d="`M ${svgElement.x - svgElement.strokeWidth / 2 - htmlToSvg(5)} ${svgElement.y + svgElement.height + svgElement.strokeWidth / 2 - htmlToSvg(5)} l ${htmlToSvg(10)} ${htmlToSvg(10)} m 0 ${htmlToSvg(-10)} l ${htmlToSvg(-10)} ${htmlToSvg(10)}`"
          stroke="black"
          :stroke-width="htmlToSvg(2)"
        />
      </g>
      <path
        :d="`M ${svgElement.x + svgElement.width + svgElement.strokeWidth / 2} ${svgElement.y + svgElement.height / 2 + svgElement.strokeWidth / 2} v ${svgElement.height / 2} h ${-svgElement.width / 2}`"
        stroke="black"
        :stroke-width="htmlToSvg(1)"
        :stroke-dasharray="`${htmlToSvg(1)}, ${htmlToSvg(5)}`"
        fill="none"
      />
      <g @mousedown="$emit('startResize', svgElement.id)">
        <SvgCircle
          :cx="svgElement.x + svgElement.width + svgElement.strokeWidth / 2"
          :cy="svgElement.y + svgElement.height + svgElement.strokeWidth / 2"
          :r="htmlToSvg(10)"
          stroke="black"
          fill="white"
        />
        <path
          :d="`M ${svgElement.x + svgElement.width + svgElement.strokeWidth / 2 + htmlToSvg(5)} ${svgElement.y + svgElement.height + svgElement.strokeWidth / 2 - htmlToSvg(5)} v ${htmlToSvg(10)} h ${htmlToSvg(-10)} z`"
          stroke="black"
        />
      </g>
      <g @mousedown="$emit('startResizeWidth', svgElement.id)">
        <path
          :d="`M ${svgElement.x + svgElement.width / 2} ${svgElement.y + svgElement.height} v ${htmlToSvg(15) + svgElement.strokeWidth / 2}`"
          stroke="black"
          :stroke-width="htmlToSvg(1)"
          :stroke-dasharray="`${htmlToSvg(1)}, ${htmlToSvg(5)}`"
          fill="none"
        />
        <SvgCircle
          :cx="svgElement.x + svgElement.width / 2"
          :cy="svgElement.y + svgElement.height + htmlToSvg(15) + svgElement.strokeWidth / 2"
          :r="htmlToSvg(7)"
          stroke="black"
          fill="white"
        />
        <path
          :d="`M ${svgElement.x + svgElement.width / 2 - htmlToSvg(5)} ${svgElement.y + svgElement.height + htmlToSvg(15) + svgElement.strokeWidth / 2} h ${htmlToSvg(10)}`"
          stroke="black"
          :stroke-width="htmlToSvg(3)"
        />
      </g>
    </template>
  </g>
</template>

<script>
import BaseElement from './BaseElement'
import SvgCircle from '@/components/atoms/SvgCircle'

export default {
  extends: BaseElement,
  components: {
    SvgCircle
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
  }
}
</script>

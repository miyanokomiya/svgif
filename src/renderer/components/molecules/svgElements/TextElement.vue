<template>
<g :transform="transform">
  <g @mousedown="$emit('startMove', svgElement.id)">
    <g v-if="selected && !plain">
      <SvgText
        v-for="(line, i) in lines" :key="i"
        :x="0"
        :y="lineHeight * i"
        :fill="selectedStroke"
        :fontSize="svgElement.fontSize"
        :fillOpacity="selectedStrokeOpacity"
        :text="line"
        dominant-baseline="hanging"
      />
    </g>
    <g>
      <SvgText
        v-for="(line, i) in lines" :key="i"
        :x="0"
        :y="lineHeight * i"
        :fill="svgElement.stroke"
        :fontSize="svgElement.fontSize"
        :text="line"
        dominant-baseline="hanging"
      />
    </g>
  </g>
  <g v-if="selected && !plain">
    <OptionPath :d="`M 0 ${height / 2} v ${-height / 2} h ${height / 2}`" />
    <MoveItem
      :scale="scale"
      :cx="0"
      :cy="0"
      @mousedown.native="$emit('startMove', svgElement.id)"
    />
    <OptionPath :d="`M 0 ${height / 2} v ${height / 2} h ${height / 2}`" />
    <ResizeItem
      :scale="scale"
      :cx="0"
      :cy="height"
      :radian="Math.PI / 4"
      @mousedown.native="$emit('startResize', svgElement.id)"
    />
    <TextItem
      :scale="scale"
      :cx="0"
      :cy="height / 2"
      @mousedown.native="$emit('startEditText', svgElement.id)"
    />
  </g>
</g>
</template>

<script>
import BaseElement from './BaseElement'
import SvgText from '@/components/atoms/SvgText'
import MoveItem from '@/components/molecules/svgParts/MoveItem'
import OptionPath from '@/components/molecules/svgParts/OptionPath'
import ResizeItem from '@/components/molecules/svgParts/ResizeItem'
import TextItem from '@/components/molecules/svgParts/TextItem'

import {
  getTextElementLineHeight,
  getTextElementHeight,
  getTextLines
} from '@/commons/utils/element'

export default {
  extends: BaseElement,
  components: {
    SvgText,
    MoveItem,
    OptionPath,
    ResizeItem,
    TextItem
  },
  computed: {
    rect() {
      return {
        ...this.svgElement,
        x: this.svgElement.x + this.moveVec.x,
        y: this.svgElement.y + this.moveVec.y
      }
    },
    lines() {
      return getTextLines(this.svgElement)
    },
    lineHeight() {
      return getTextElementLineHeight(this.svgElement)
    },
    height() {
      return getTextElementHeight(this.svgElement)
    },
    transform() {
      return `translate(${this.rect.x},${this.rect.y})`
    }
  }
}
</script>

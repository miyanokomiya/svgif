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
    <g ref="main">
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
  <g v-if="!plain">
    <OptionPath :d="`M 0 ${height / 2} v ${-height / 2} h ${height / 2}`" />
    <MoveItem
      :scale="scale"
      :cx="0"
      :cy="0"
      @mousedown.native="$emit('startMove', svgElement.id)"
    />
    <template v-if="selected">
      <OptionPath :d="`M 0 ${height / 2} v ${height / 2} h ${height / 2}`" />
      <DeleteItem
        :scale="scale"
        :cx="-htmlToSvg(20)"
        :cy="height"
        @mousedown.native="$emit('deleteElement', svgElement.id)"
      />
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
    </template>
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
import DeleteItem from '@/components/molecules/svgParts/DeleteItem'

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
    TextItem,
    DeleteItem
  },
  data: () => ({
    bbox: null
  }),
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
  },
  mounted() {
    this.recalcBBox()
  },
  watch: {
    svgElement: {
      handler() {
        this.recalcBBox()
      },
      deep: true
    },
    scale() {
      this.recalcBBox()
    }
  },
  methods: {
    getBBox() {
      if (!this.$refs.main) return
      return this.$refs.main.getBBox()
    },
    recalcBBox() {
      this.bbox = this.getBBox()
    }
  }
}
</script>

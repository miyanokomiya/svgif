<template>
  <RectangleElement
    v-if="svgElement.name === 'rectangle'"
    :svgElement="svgElement"
    :moveVec="moveVec"
    :selected="selected"
    :scale="scale"
    :plain="plain"
    @startMove="startMove"
    @deleteElement="deleteElement"
    @startResize="startResize"
    @startResizeWidth="startResizeWidth"
    @startRotate="startRotate"
  />
  <CircleElement
    v-else-if="svgElement.name === 'circle'"
    :svgElement="svgElement"
    :moveVec="moveVec"
    :selected="selected"
    :scale="scale"
    :plain="plain"
    @startMove="startMove"
    @deleteElement="deleteElement"
    @startResize="startResize"
    @startResizeWidth="startResizeWidth"
    @startRotate="startRotate"
  />
  <LineElement
    v-else-if="svgElement.name === 'line'"
    :svgElement="svgElement"
    :moveVec="moveVec"
    :selected="selected"
    :scale="scale"
    :plain="plain"
    @startMove="startMove"
    @deleteElement="deleteElement"
    @startResize="startResize"
    @startResizeWidth="startResizeWidth"
    @startRotate="startRotate"
    @startResizeLine1="startResizeLine1"
    @startResizeLine2="startResizeLine2"
  />
  <ArrowElement
    v-else-if="svgElement.name === 'arrow'"
    :svgElement="svgElement"
    :moveVec="moveVec"
    :selected="selected"
    :scale="scale"
    :plain="plain"
    @startMove="startMove"
    @deleteElement="deleteElement"
    @startResize="startResize"
    @startResizeWidth="startResizeWidth"
    @startRotate="startRotate"
    @startResizeLine1="startResizeLine1"
    @startResizeLine2="startResizeLine2"
    @startResizeArrow2="startResizeArrow2"
  />
  <TextElement
    v-else-if="svgElement.name === 'text'"
    :svgElement="svgElement"
    :moveVec="moveVec"
    :selected="selected"
    :scale="scale"
    :plain="plain"
    @startMove="startMove"
    @deleteElement="deleteElement"
    @startResize="startResize"
    @startRotate="startRotate"
  />
</template>

<script>
import RectangleElement from './svgElements/RectangleElement'
import CircleElement from './svgElements/CircleElement'
import LineElement from './svgElements/LineElement'
import ArrowElement from './svgElements/ArrowElement'
import TextElement from './svgElements/TextElement'

export default {
  components: {
    RectangleElement,
    CircleElement,
    LineElement,
    ArrowElement,
    TextElement
  },
  props: {
    svgElement: {
      type: Object,
      required: true
    },
    moveVec: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    },
    selected: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1
    },
    plain: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    startMove(id) {
      this.$emit('startMove', id)
    },
    deleteElement(id) {
      this.$emit('deleteElement', id)
    },
    startResize(id) {
      this.$emit('startResize', id)
    },
    startResizeWidth(id) {
      this.$emit('startResizeWidth', id)
    },
    startRotate(id) {
      this.$emit('startRotate', id)
    },
    startResizeLine1(id) {
      this.$emit('startResizeLine1', id)
    },
    startResizeLine2(id) {
      this.$emit('startResizeLine2', id)
    },
    startResizeArrow2(id) {
      this.$emit('startResizeArrow2', id)
    }
  }
}
</script>

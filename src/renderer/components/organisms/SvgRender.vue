<template>
  <SvgCanvas
    :width="size.width"
    :height="size.height"
  >
    <SvgElement
      v-for="svgElement in svgElementList"
      :key="svgElement.id"
      :svgElement="svgElement"
      plain
    />
  </SvgCanvas>
</template>

<script>
import SvgCanvas from '@/components/molecules/SvgCanvas'
import SvgElement from '@/components/molecules/SvgElement'

export default {
  components: {
    SvgCanvas,
    SvgElement
  },
  props: {
    svgElementList: {
      type: Array,
      default: () => []
    },
    size: {
      type: Object,
      default: () => ({ width: 100, height: 100 })
    }
  }
}
</script>

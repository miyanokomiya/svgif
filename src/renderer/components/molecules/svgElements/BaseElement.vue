<script>
import scaleConverter from '@/commons/mixins/scaleConverter'

export default {
  mixins: [scaleConverter],
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
  computed: {
    selectedStroke() {
      return 'lime'
    },
    selectedStrokeOpacity() {
      return 0.7
    },
    selectedStrokeWidth() {
      return this.svgElement.strokeWidth + this.htmlToSvg(5)
    }
  }
}
</script>

<script>
import * as elementUtils from '@/commons/utils/element'

export default {
  methods: {
    htmlToSvg(val) {
      return elementUtils.htmlToSvg(this.scale, val)
    },
    svgToHtml(val) {
      return elementUtils.svgToHtml(this.scale, val)
    }
  }
}
</script>

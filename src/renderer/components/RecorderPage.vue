<template>
  <el-container class="recorder-page">
    <el-main ref="frame" :class="{ flash }">
      <!-- 十字ターゲットを出したかったが、domを消しても焼付きが残ってしまう現象を回避できず -->
    </el-main>
    <el-footer height="40px">
      <el-button
        type="danger" size="small" round
        icon="el-icon-success"
        @click="addImage"
      />
    </el-footer>
  </el-container>
</template>

<script>
import electron from 'electron'
import { mapActions } from 'vuex'
import { types as clipTypes } from '@main/store/modules/clips'
import { screenshot } from '@/commons/utils/screenCapture'

const VORDER_SIZE = 6

export default {
  data: () => ({
    flash: false,
    shooting: false
  }),
  methods: {
    ...mapActions({
      _createClip: clipTypes.a.CREATE_CLIP,
      _deleteClip: clipTypes.a.DELETE_CLIP
    }),
    getScreenshotRange() {
      const workArea = electron.screen.getPrimaryDisplay().workArea
      const frameRect = this.$refs.frame.$el.getBoundingClientRect()
      return {
        x: window.screenX + workArea.x + frameRect.left + VORDER_SIZE,
        y: window.screenY + workArea.y - 1 + frameRect.top + VORDER_SIZE,
        width: frameRect.width - VORDER_SIZE * 2,
        height: frameRect.height - VORDER_SIZE * 2
      }
    },
    addImage() {
      if (this.shooting) return
      this.shooting = true
      screenshot({ range: this.getScreenshotRange() })
        .then(({ base64 }) => {
          this.shooting = false
          this.flash = true
          setTimeout(() => {
            this.flash = false
          }, 100)
          this._createClip({ clip: { base64 } })
        })
        .catch(e => {
          this.shooting = false
          console.log(e)
          alert('failed to screenshot.', e.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.recorder-page {
  height: 100vh;
  // background-color: rgba(#fff, 0.5);
}
.el-main {
  -webkit-app-region: drag; // 効いていないっぽい
  border: 6px solid tomato;
  transition: all 0.1s;
  &.flash {
    background-color: rgba(gray, 1);
  }
}
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  // line-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

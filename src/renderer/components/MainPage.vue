<template>
  <el-container class="main-page">
    <el-aside width="200px">
      <el-button
        v-if="!$svgif.isWeb"
        icon="el-icon-picture"
        size="mini"
        @click="showRecorderWindow"
      >
        Capture
      </el-button>
      <div class="tool-box">
        <DrawTools class="draw-tools"/>
        <CanvasHistory class="canvas-history"/>
      </div>
    </el-aside>
    <el-container>
      <el-main>
        <el-tabs type="border-card" v-model="tabValue">
          <el-tab-pane label="Canvas" name="Canvas">
            <el-main>
              <ClipCanvas v-if="tabValue === 'Canvas'"/>
            </el-main>
            <el-footer height="40px">
              <CanvasFooter
                @createGif="createGif"
              />
            </el-footer>
          </el-tab-pane>
          <el-tab-pane label="Gif" name="Gif" v-if="gif">
            <el-main>
              <GifCanvas
                v-if="tabValue === 'Gif'"
                :gif="gif"
                :clipList="CLIP_LIST"
                @selectClip="selectClip"
              />
            </el-main>
            <el-footer height="40px">
              <GifFooter
                :gif="gif"
                @createGif="createGif"
              />
            </el-footer>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import clipTypes from '@main/store/modules/clips/types'
import DrawTools from '@/components/organisms/sidebars/DrawTools'
import CanvasHistory from '@/components/organisms/sidebars/CanvasHistory'
import ClipCanvas from '@/components/organisms/ClipCanvas'
import GifCanvas from '@/components/organisms/GifCanvas'
import CanvasFooter from '@/components/organisms/CanvasFooter'
import GifFooter from '@/components/organisms/GifFooter'
import ImagePanel from '@/components/atoms/ImagePanel'
import { createGif } from '@/commons/utils/gif'

export default {
  components: {
    DrawTools,
    CanvasHistory,
    ClipCanvas,
    GifCanvas,
    CanvasFooter,
    GifFooter,
    ImagePanel
  },
  data: () => ({
    tabValue: 'Canvas',
    gif: ''
  }),
  computed: {
    ...mapGetters({
      CLIP_LIST: clipTypes.g.CLIP_LIST,
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE
    })
  },
  methods: {
    ...mapActions({
      _deleteClip: clipTypes.a.DELETE_CLIP,
      _deleteAllClip: clipTypes.a.DELETE_ALL_CLIP,
      _selectClip: clipTypes.a.SELECT_CLIP,
      _swapClipOrder: clipTypes.a.SWAP_CLIP_ORDER,
      _updateDelay: clipTypes.a.UPDATE_DELAY
    }),
    removeClip(id) {
      this._deleteClip(id)
    },
    deleteAllClip() {
      this._deleteAllClip()
    },
    selectClip(id) {
      this._selectClip(id)
    },
    swapClipOrder({ from, to }) {
      this._swapClipOrder({ from, to })
    },
    createGif() {
      const loading = this.$loading({
        lock: true,
        text: 'Creating...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      createGif({ clipList: this.CLIP_LIST, size: this.WHOLE_SIZE })
        .then(blob => {
          const fileReader = new FileReader()
          fileReader.onload = () => {
            this.gif = fileReader.result
            this.tabValue = 'Gif'
          }
          fileReader.readAsDataURL(blob)
          loading.close()
        })
        .catch(e => {
          loading.close()
          console.log(e)
          this.$notify.error({
            title: 'Error',
            message: `Error. ${e.message}`
          })
        })
    },
    updateDelay({ id, delay }) {
      this._updateDelay({ id, delay })
    },
    showRecorderWindow() {
      const ipcRenderer = require('electron').ipcRenderer
      ipcRenderer.send('show-recorder-window')
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  height: 100vh;
}
.el-aside {
  background-color: rgb(238, 241, 246);
  color: #333;
  text-align: center;
  padding: 0.4rem 0 0;
  .tool-box {
    height: calc(100% - 32px - 0.1rem);
    .draw-tools {
      height: calc(50%);
    }
    .canvas-history {
      height: calc(50%);
    }
  }
}
.el-main {
  padding: 0;
  .el-tabs {
    height: 100%;
    /deep/ .el-tabs__content {
      height: calc(100% - 39px);
      padding: 0;
      .el-tab-pane {
        height: 100%;
        .el-main {
          height: calc(100% - 40px);
        }
      }
    }
  }
  .gif-image {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }
}
.el-footer {
  padding: 0;
}
</style>

<template>
  <el-container class="main-page">
    <el-aside width="200px">
      <el-button
        v-if="!$svgif.isWeb"
        icon="el-icon-download"
        size="mini"
        @click="saveState"
      >
        Save
      </el-button>
      <el-button
        v-if="!$svgif.isWeb"
        icon="el-icon-upload2"
        size="mini"
        @click="selectFile"
      >
        Load
      </el-button>
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
    <input
      v-if="!clearFileInputFlag"
      v-show="false"
      ref="fileInput"
      type="file"
      accept="application/json"
      @change="importState"
    />
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import clipTypes from '@/store/modules/clips/types'
import DrawTools from '@/components/organisms/sidebars/DrawTools'
import CanvasHistory from '@/components/organisms/sidebars/CanvasHistory'
import ClipCanvas from '@/components/organisms/ClipCanvas'
import GifCanvas from '@/components/organisms/GifCanvas'
import CanvasFooter from '@/components/organisms/CanvasFooter'
import GifFooter from '@/components/organisms/GifFooter'
import ImagePanel from '@/components/atoms/ImagePanel'
import { createGif } from '@/commons/utils/gif'
import { saveJsonFile } from '@/commons/utils/file'

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
    gif: '',
    clearFileInputFlag: false
  }),
  computed: {
    ...mapGetters({
      CLIP_LIST: clipTypes.g.CLIP_LIST,
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP,
      WHOLE_SIZE: clipTypes.g.WHOLE_SIZE,
      MAX_SIZE: clipTypes.g.MAX_SIZE,
      STATE: clipTypes.g.STATE
    })
  },
  methods: {
    ...mapActions({
      _deleteClip: clipTypes.a.DELETE_CLIP,
      _deleteAllClip: clipTypes.a.DELETE_ALL_CLIP,
      _selectClip: clipTypes.a.SELECT_CLIP,
      _swapClipOrder: clipTypes.a.SWAP_CLIP_ORDER,
      _updateDelay: clipTypes.a.UPDATE_DELAY,
      _importState: clipTypes.a.IMPORT_STATE
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
      createGif({
        clipList: this.CLIP_LIST,
        size: this.WHOLE_SIZE,
        maxSize: this.MAX_SIZE
      })
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
    },
    saveState() {
      saveJsonFile(this.STATE)
    },
    importState(e) {
      if (e.target.files.length === 0) return
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        this._importState(JSON.parse(reader.result))
        this.clearFileInput()
      }
      reader.onerror = err => {
        this.$notify.error({
          title: 'Error',
          message: err.message
        })
      }
    },
    selectFile() {
      this.$refs.fileInput.click()
    },
    clearFileInput() {
      this.clearFileInputFlag = true
      this.$nextTick(() => {
        this.clearFileInputFlag = false
      })
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
  .el-button.el-button {
    margin-left: 0;
  }
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

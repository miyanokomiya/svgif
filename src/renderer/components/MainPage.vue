<template>
  <el-container class="main-page">
    <el-aside width="200px">
      <ThumbnailList
        class="side-menu"
        :clipList="CLIP_LIST"
        :selectedId="SELECTED_CLIP ? SELECTED_CLIP.id : undefined"
        @removeClip="removeClip"
        @selectClip="selectClip"
        @swapClipOrder="swapClipOrder"
        @updateDelay="updateDelay"
        @deleteAllClip="deleteAllClip"
      />
    </el-aside>
    <el-container>
      <el-main>
        <el-tabs type="border-card">
          <el-tab-pane label="Canvas">
            <el-main>
              <ClipCanvas/>
            </el-main>
            <el-footer>
              <CanvasFooter
                @createGif="createGif"
              />
            </el-footer>
          </el-tab-pane>
          <el-tab-pane label="Gif">
            <el-main>
              <GifCanvas
                :gif="gif"
                :clipList="CLIP_LIST"
                @selectClip="selectClip"
              />
            </el-main>
            <el-footer>
              <GifFooter
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
import ThumbnailList from '@/components/organisms/ThumbnailList'
import ClipCanvas from '@/components/organisms/ClipCanvas'
import GifCanvas from '@/components/organisms/GifCanvas'
import CanvasFooter from '@/components/organisms/CanvasFooter'
import GifFooter from '@/components/organisms/GifFooter'
import ImagePanel from '@/components/atoms/ImagePanel'
import { createGif } from '@/commons/utils/gif'

export default {
  components: {
    ThumbnailList,
    ClipCanvas,
    GifCanvas,
    CanvasFooter,
    GifFooter,
    ImagePanel
  },
  data: () => ({
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
      createGif({ clipList: this.CLIP_LIST, size: this.WHOLE_SIZE }).then(
        blob => {
          const fileReader = new FileReader()
          fileReader.onload = () => {
            this.gif = fileReader.result
          }
          fileReader.readAsDataURL(blob)
        }
      )
    },
    updateDelay({ id, delay }) {
      this._updateDelay({ id, delay })
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
  padding: 0.4rem 0;
  .side-menu {
    margin: 0.4rem 0;
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
          height: calc(100% - 60px);
        }
        .el-footer {
          height: 60px;
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

<template>
  <el-container class="main-page">
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>View</el-dropdown-item>
          <el-dropdown-item>Add</el-dropdown-item>
          <el-dropdown-item>Delete</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>Tom</span>
    </el-header>
    
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <ThumbnailList
          :clipList="CLIP_LIST"
          :selectedId="selectedId"
          @addImage="addImage"
          @removeImage="removeImage"
          @selectImage="selectImage"
        />
      </el-aside>
      <el-main>
        <ClipCanvas :clip="selectedClip" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import electron from 'electron'
import { mapActions, mapGetters } from 'vuex'
import { types as clipTypes } from '@main/store/modules/Clips'
import { screenshot } from '@/commons/utils/screenCapture'
import ThumbnailList from '@/components/organisms/ThumbnailList'
import ClipCanvas from '@/components/organisms/ClipCanvas'

export default {
  components: {
    ThumbnailList,
    ClipCanvas
  },
  data: () => ({
    selectedId: -1
  }),
  computed: {
    ...mapGetters({
      CLIP_LIST: clipTypes.g.CLIP_LIST
    }),
    selectedClip() {
      return this.CLIP_LIST.find(c => c.id === this.selectedId)
    }
  },
  watch: {
    CLIP_LIST() {
      if (!this.selectedClip) this.selectedId = -1
    }
  },
  methods: {
    ...mapActions({
      _createClip: clipTypes.a.CREATE_CLIP,
      _deleteClip: clipTypes.a.DELETE_CLIP
    }),
    addImage({ index }) {
      const workArea = electron.screen.getPrimaryDisplay().workArea
      const range = {
        x: window.screenX + workArea.x,
        y: window.screenY + workArea.y - 1,
        width: window.innerWidth,
        height: window.innerHeight
      }
      screenshot({ range })
        .then(({ base64 }) => {
          this._createClip({ clip: { base64 }, index })
        })
        .catch(e => console.log(e))
    },
    removeImage(id) {
      this._deleteClip(id)
    },
    selectImage(id) {
      this.selectedId = id
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  height: 100vh;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>

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
      <el-aside width="200px">
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAllClip">Delete All</el-button>
        <ThumbnailList
          class="thumbnail-list"
          :clipList="CLIP_LIST"
          :selectedId="SELECTED_CLIP ? SELECTED_CLIP.id : undefined"
          @removeClip="removeClip"
          @selectClip="selectClip"
          @swapClipOrder="swapClipOrder"
        />
      </el-aside>
      <el-main>
        <ClipCanvas :clip="SELECTED_CLIP" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { types as clipTypes } from '@main/store/modules/clips'
import ThumbnailList from '@/components/organisms/ThumbnailList'
import ClipCanvas from '@/components/organisms/ClipCanvas'

export default {
  components: {
    ThumbnailList,
    ClipCanvas
  },
  computed: {
    ...mapGetters({
      CLIP_LIST: clipTypes.g.CLIP_LIST,
      SELECTED_CLIP: clipTypes.g.SELECTED_CLIP
    })
  },
  methods: {
    ...mapActions({
      _deleteClip: clipTypes.a.DELETE_CLIP,
      _deleteAllClip: clipTypes.a.DELETE_ALL_CLIP,
      _selectClip: clipTypes.a.SELECT_CLIP,
      _swapClipOrder: clipTypes.a.SWAP_CLIP_ORDER
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
  background-color: rgb(238, 241, 246);
  color: #333;
  text-align: center;
  padding: 0.4rem 0;
  .thumbnail-list {
    margin: 0.4rem 0;
  }
}
</style>

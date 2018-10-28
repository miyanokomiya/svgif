<template>
  <el-container>
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
        <thumbnailList
          :dataList="CLIP_LIST"
          @addImage="addImage"
        />
      </el-aside>
      <el-main>
        aaaaaaa
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { types as clipTypes } from '@/store/modules/Clips'
import { screenshot } from '@/commons/utils/screenCapture'
import thumbnailList from '@/components/organisms/thumbnailList'
const electron = require('electron')
const electronScreen = electron.screen
export default {
  components: {
    thumbnailList
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters({
      CLIP_LIST: clipTypes.g.CLIP_LIST
    })
  },
  methods: {
    ...mapActions({
      _createClip: clipTypes.a.CREATE_CLIP,
      _deleteClip: clipTypes.a.DELETE_CLIP
    }),
    addImage ({ index }) {
      const workArea = electronScreen.getPrimaryDisplay().workArea
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
    }
  }
}
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>


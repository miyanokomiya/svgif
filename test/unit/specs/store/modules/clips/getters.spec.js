import clips, { types } from '@main/store/modules/clips'

describe('store/modules/clips/getters', () => {
  describe('CLIP_LIST', () => {
    it('clipList が取得されること', () => {
      const state = {
        clipList: [1, 2]
      }
      const clipList = clips.getters[types.g.CLIP_LIST](state)
      expect(clipList).to.have.lengthOf(2)
      expect(clipList[0]).to.equal(1)
      expect(clipList[1]).to.equal(2)
    })
  })
  describe('SELECTED_CLIP', () => {
    context('selectedId に対応した要素が存在する場合', () => {
      it('selectedId に対応した要素 が取得されること', () => {
        const state = {
          clipList: [{ id: 1 }, { id: 2 }, { id: 3 }],
          selectedId: 2
        }
        const clip = clips.getters[types.g.SELECTED_CLIP](state)
        expect(clip.id).to.equal(2)
      })
    })
    context('selectedId に対応した要素が存在しない場合', () => {
      it('null が取得されること', () => {
        const state = {
          clipList: [{ id: 1 }, { id: 2 }, { id: 3 }],
          selectedId: 4
        }
        const clip = clips.getters[types.g.SELECTED_CLIP](state)
        expect(clip).to.equal(null)
      })
    })
  })
  describe('WHOLE_SIZE', () => {
    it('最大の width と height が取得されること', () => {
      const state = {
        clipList: [
          { id: 1, width: 3, height: 1 },
          { id: 2, width: 2, height: 2 },
          { id: 3, width: 1, height: 5 }
        ]
      }
      const size = clips.getters[types.g.WHOLE_SIZE](state)
      expect(size.width).to.equal(3)
      expect(size.height).to.equal(5)
    })
  })
})

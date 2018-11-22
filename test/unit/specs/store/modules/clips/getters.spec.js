import types from '@/store/modules/clips/types'
import getters from '@/store/modules/clips/getters'

describe('store/modules/clips/getters', () => {
  describe('MAX_SIZE', () => {
    it('maxSize が取得されること', () => {
      const state = { maxSize: 1 }
      const maxSize = getters[types.g.MAX_SIZE](state)
      expect(maxSize).to.equal(1)
    })
  })
  describe('CLIP_LIST', () => {
    it('clipList が取得されること', () => {
      const state = {
        clipList: [1, 2]
      }
      const clipList = getters[types.g.CLIP_LIST](state)
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
        const clip = getters[types.g.SELECTED_CLIP](state)
        expect(clip.id).to.equal(2)
      })
    })
    context('selectedId に対応した要素が存在しない場合', () => {
      it('null が取得されること', () => {
        const state = {
          clipList: [{ id: 1 }, { id: 2 }, { id: 3 }],
          selectedId: 4
        }
        const clip = getters[types.g.SELECTED_CLIP](state)
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
      const size = getters[types.g.WHOLE_SIZE](state)
      expect(size.width).to.equal(3)
      expect(size.height).to.equal(5)
    })
  })
  describe('WHOLE_DELAY', () => {
    it('delay の合計が取得されること', () => {
      const state = {
        clipList: [
          { id: 1, delay: 1 },
          { id: 2, delay: 20 },
          { id: 3, delay: 30 }
        ]
      }
      const val = getters[types.g.WHOLE_DELAY](state)
      expect(val).to.equal(51)
    })
  })
  describe('STATE', () => {
    it('state が取得されること', () => {
      const state = 1
      const val = getters[types.g.STATE](state)
      expect(val).to.equal(1)
    })
  })
})

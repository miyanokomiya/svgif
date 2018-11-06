import * as geo from '@/commons/utils/geo'

describe('geo 幾何計算モジュールのテスト', () => {
  describe('isPointInRect 点が矩形に含まれるか判定', () => {
    const rect = { x: 0, y: 0, width: 1, height: 2 }
    context('含まれるとき', () => {
      it('true であること', () => {
        expect(geo.isPointInRect(rect, { x: 0.5, y: 1 })).to.equal(true)
      })
    })
    context('左にはみ出しているとき', () => {
      it('false であること', () => {
        expect(geo.isPointInRect(rect, { x: -0.5, y: 1 })).to.equal(false)
      })
    })
    context('右にはみ出しているとき', () => {
      it('false であること', () => {
        expect(geo.isPointInRect(rect, { x: 1.5, y: 1 })).to.equal(false)
      })
    })
    context('上にはみ出しているとき', () => {
      it('false であること', () => {
        expect(geo.isPointInRect(rect, { x: 0.5, y: -1 })).to.equal(false)
      })
    })
    context('下にはみ出しているとき', () => {
      it('false であること', () => {
        expect(geo.isPointInRect(rect, { x: 0.5, y: 3 })).to.equal(false)
      })
    })
  })
  describe('isRectInRect 矩形が矩形に含まれるか判定', () => {
    const rect = { x: 0, y: 0, width: 1, height: 2 }
    context('含まれるとき', () => {
      it('true であること', () => {
        const rect2 = { x: 0.5, y: 1, width: 0.3, height: 0.5 }
        expect(geo.isRectInRect(rect, rect2)).to.equal(true)
      })
    })
    context('上がはみ出しているとき', () => {
      it('false であること', () => {
        const rect2 = { x: 0.5, y: -1, width: 0.3, height: 1 }
        expect(geo.isRectInRect(rect, rect2)).to.equal(false)
      })
    })
    context('右がはみ出しているとき', () => {
      it('false であること', () => {
        const rect2 = { x: 0.5, y: 1, width: 1.3, height: 0.5 }
        expect(geo.isRectInRect(rect, rect2)).to.equal(false)
      })
    })
    context('左がはみ出しているとき', () => {
      it('false であること', () => {
        const rect2 = { x: -0.5, y: 1, width: 1, height: 0.5 }
        expect(geo.isRectInRect(rect, rect2)).to.equal(false)
      })
    })
    context('下がはみ出しているとき', () => {
      it('false であること', () => {
        const rect2 = { x: 0.5, y: 1, width: 0.3, height: 1.5 }
        expect(geo.isRectInRect(rect, rect2)).to.equal(false)
      })
    })
  })
})

import * as geo from '@/commons/utils/geo'

const THRESHOLD = 0.001

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
  describe('distance ２点の距離取得', () => {
    it('正しく取得されること', () => {
      const d = geo.distance({ x: 1, y: 2 }, { x: 4, y: 6 })
      expect(d).to.closeTo(5, THRESHOLD)
    })
  })
  describe('norm ノルム取得', () => {
    it('正しく取得されること', () => {
      const n = geo.norm({ x: 3, y: 4 })
      expect(n).to.closeTo(5, THRESHOLD)
    })
  })
  describe('vector ２点のベクトル取得', () => {
    it('正しく取得されること', () => {
      const v = geo.vector({ x: 1, y: 2 }, { x: 2, y: 4 })
      expect(v.x).to.equal(1)
      expect(v.y).to.equal(2)
    })
  })
  describe('unitVector ２点の単位ベクトル取得', () => {
    context('同座標の場合', () => {
      it('ゼロベクトルが取得されること', () => {
        const v = geo.unitVector({ x: 1, y: 2 }, { x: 1, y: 2 })
        expect(v.x).to.equal(0)
        expect(v.y).to.equal(0)
      })
    })
    context('同座標ではないの場合', () => {
      it('正しく取得されること', () => {
        const v = geo.unitVector({ x: 0, y: 0 }, { x: 3, y: 4 })
        expect(v.x).to.closeTo(3 / 5, THRESHOLD)
        expect(v.y).to.closeTo(4 / 5, THRESHOLD)
      })
    })
  })
  describe('center ２点の中心取得', () => {
    it('正しく取得されること', () => {
      const c = geo.center({ x: 0, y: 0 }, { x: 2, y: 4 })
      expect(c.x).to.equal(1)
      expect(c.y).to.equal(2)
    })
  })
  describe('getNormalRect 矩形の正規化', () => {
    it('正しく取得されること', () => {
      const rec = geo.getNormalRect({ x: 0, y: 0, width: -1, height: -2 })
      expect(rec.x).to.equal(-1)
      expect(rec.y).to.equal(-2)
      expect(rec.width).to.equal(1)
      expect(rec.height).to.equal(2)
    })
  })
})

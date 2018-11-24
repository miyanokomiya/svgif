import * as gif from '@/commons/utils/gif'

describe('gif GIF関連処理モジュール', () => {
  describe('splitFrame', () => {
    it('フレーム区切り一覧を取得できること', () => {
      const res = gif.splitFrame([
        { from: 0, to: 10 },
        { from: 5, to: 10 },
        { from: 11, to: 20 }
      ])
      expect(res).to.have.lengthOf(4)
      expect(res[0]).to.equal(0)
      expect(res[1]).to.equal(5)
      expect(res[2]).to.equal(10)
      expect(res[3]).to.equal(11)
    })
  })
  describe('getFrameInfo', () => {
    const getArgs = () => ({
      clipList: [
        { id: 1, delay: 10 },
        { id: 2, delay: 10 },
        { id: 3, delay: 10 }
      ],
      layerList: [
        { id: 101, from: 0, to: 10 },
        { id: 102, from: 5, to: 10 },
        { id: 103, from: 10, to: 15 }
      ],
      currentTime: 10
    })
    it('フレームに対応するクリップとレイヤーが取得できること', () => {
      const res = gif.getFrameInfo(getArgs())
      expect(res.clip.id).to.equal(2)
      expect(res.layerList).to.have.lengthOf(1)
      expect(res.layerList[0].id).to.equal(103)
    })
    it('フレームに対応するクリップとレイヤーが取得できること', () => {
      const res = gif.getFrameInfo({ ...getArgs(), currentTime: 5 })
      expect(res.clip.id).to.equal(1)
      expect(res.layerList).to.have.lengthOf(2)
      expect(res.layerList[0].id).to.equal(101)
      expect(res.layerList[1].id).to.equal(102)
    })
  })
  describe('getSplitFrameList', () => {
    const getArgs = () => ({
      clipList: [
        { id: 1, delay: 10 },
        { id: 2, delay: 10 },
        { id: 3, delay: 10 }
      ],
      layerList: [
        { id: 101, from: 0, to: 10 },
        { id: 102, from: 5, to: 10 },
        { id: 103, from: 10, to: 15 }
      ]
    })
    it('クリップとレイヤーのフレーム区切り一覧を取得できること', () => {
      const res = gif.getSplitFrameList(getArgs())
      expect(res).to.have.lengthOf(5)
      expect(res[0]).to.equal(0)
      expect(res[1]).to.equal(5)
      expect(res[2]).to.equal(10)
      expect(res[3]).to.equal(15)
      expect(res[4]).to.equal(20)
    })
  })
  describe('getFrameInfoList', () => {
    const getArgs = () => ({
      clipList: [
        { id: 1, delay: 10 },
        { id: 2, delay: 10 },
        { id: 3, delay: 10 }
      ],
      layerList: [
        { id: 101, from: 0, to: 10 },
        { id: 102, from: 5, to: 10 },
        { id: 103, from: 10, to: 15 }
      ]
    })
    it('フレームに対応するクリップとレイヤーが取得できること', () => {
      const res = gif.getFrameInfoList(getArgs())
      expect(res).to.have.lengthOf(5)
      expect(res[0].delay).to.equal(5)
      expect(res[1].delay).to.equal(5)
      expect(res[2].delay).to.equal(5)
      expect(res[3].delay).to.equal(5)
      expect(res[4].delay).to.equal(10)
    })
  })
})

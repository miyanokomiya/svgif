import * as svgElements from '@/commons/models/svgElements'

describe('svgElements', () => {
  describe('completeElement 要素のデータ補完', () => {
    context('rectangle の場合', () => {
      it('補完されること', () => {
        const after = svgElements.completeElement({
          name: 'rectangle',
          x: 1
        })
        expect(after.x).to.equal(1)
        expect(after.y).to.equal(0)
      })
    })
    context('circle の場合', () => {
      it('補完されること', () => {
        const after = svgElements.completeElement({
          name: 'circle',
          x: 1
        })
        expect(after.x).to.equal(1)
        expect(after.y).to.equal(0)
      })
    })
    context('line の場合', () => {
      it('補完されること', () => {
        const after = svgElements.completeElement({
          name: 'line',
          x1: 1
        })
        expect(after.x1).to.equal(1)
        expect(after.y2).to.equal(0)
      })
    })
    context('arrow の場合', () => {
      it('補完されること', () => {
        const after = svgElements.completeElement({
          name: 'arrow',
          x1: 1
        })
        expect(after.x1).to.equal(1)
        expect(after.depth2).to.equal(50)
      })
    })
    context('未定義 の場合', () => {
      it('例外が発生すること', () => {
        expect(() => {
          svgElements.completeElement({
            name: 'unknown'
          })
        }).to.throw()
      })
    })
  })
})

import * as clip from '@/commons/models/clip'

describe('clip', () => {
  describe('completeClip クリップデータ補完', () => {
    describe('単純プロパティ補完', () => {
      it('補完されること', () => {
        const after = clip.completeClip({})
        expect(after.id).is.a('number')
        expect(after.createdAt).is.a('string')
        expect(after.delay).is.a('number')
        expect(after.base64).is.a('string')
        expect(after.width).is.a('number')
        expect(after.height).is.a('number')
      })
      it('上書きはされないこと', () => {
        const after = clip.completeClip({
          id: 1,
          createdAt: 'abc',
          delay: 2,
          base64: 'def',
          width: 3,
          height: 4
        })
        expect(after.id).to.equal(1)
        expect(after.createdAt).to.equal('abc')
        expect(after.delay).to.equal(2)
        expect(after.base64).to.equal('def')
        expect(after.width).to.equal(3)
        expect(after.height).to.equal(4)
      })
    })
    describe('svgElementList 補完', () => {
      it('svgElementList が補完されること', () => {
        const after = clip.completeClip({})
        expect(after.svgElementList).to.have.lengthOf(0)
      })
      it('svgElementList の中身が補完されること', () => {
        const after = clip.completeClip({
          svgElementList: [{ name: 'rectangle' }]
        })
        expect(after.svgElementList).to.have.lengthOf(1)
        expect(after.svgElementList[0].x).to.equal(0)
      })
    })
    describe('svgElementUndoStack 補完', () => {
      it('svgElementUndoStack が補完されること', () => {
        const after = clip.completeClip({})
        expect(after.svgElementUndoStack).to.have.lengthOf(0)
      })
      context('type === REMOVE の場合', () => {
        it('svgElementUndoStack の中身が補完されること', () => {
          const after = clip.completeClip({
            svgElementUndoStack: [
              { type: 'REMOVE', svgElementList: [{ name: 'rectangle' }] }
            ]
          })
          expect(after.svgElementUndoStack).to.have.lengthOf(1)
          expect(after.svgElementUndoStack[0].type).to.equal('REMOVE')
          expect(after.svgElementUndoStack[0].svgElementList).to.have.lengthOf(
            1
          )
          expect(after.svgElementUndoStack[0].svgElementList[0].x).to.equal(0)
        })
      })
      context('type !== REMOVE の場合', () => {
        it('svgElementUndoStack の中身が補完されないこと', () => {
          const after = clip.completeClip({
            svgElementUndoStack: [
              { type: 'ADD', svgElementList: [{ name: 'rectangle' }] }
            ]
          })
          expect(after.svgElementUndoStack).to.have.lengthOf(1)
          expect(after.svgElementUndoStack[0].type).to.equal('ADD')
          expect(after.svgElementUndoStack[0].svgElementList).to.have.lengthOf(
            1
          )
          expect(after.svgElementUndoStack[0].svgElementList[0].x).to.equal(
            undefined
          )
        })
      })
    })
    describe('svgElementRedoStack 補完', () => {
      it('svgElementRedoStack が補完されること', () => {
        const after = clip.completeClip({})
        expect(after.svgElementRedoStack).to.have.lengthOf(0)
      })
      context('type === ADD の場合', () => {
        it('svgElementRedoStack の中身が補完されること', () => {
          const after = clip.completeClip({
            svgElementRedoStack: [
              { type: 'ADD', svgElementList: [{ name: 'line' }] }
            ]
          })
          expect(after.svgElementRedoStack).to.have.lengthOf(1)
          expect(after.svgElementRedoStack[0].type).to.equal('ADD')
          expect(after.svgElementRedoStack[0].svgElementList).to.have.lengthOf(
            1
          )
          expect(after.svgElementRedoStack[0].svgElementList[0].x1).to.equal(0)
        })
      })
      context('type !== ADD の場合', () => {
        it('svgElementRedoStack の中身が補完されないこと', () => {
          const after = clip.completeClip({
            svgElementRedoStack: [
              { type: 'UPDATE', svgElementList: [{ name: 'line' }] }
            ]
          })
          expect(after.svgElementRedoStack).to.have.lengthOf(1)
          expect(after.svgElementRedoStack[0].type).to.equal('UPDATE')
          expect(after.svgElementRedoStack[0].svgElementList).to.have.lengthOf(
            1
          )
          expect(after.svgElementRedoStack[0].svgElementList[0].x1).to.equal(
            undefined
          )
        })
      })
    })
  })
})

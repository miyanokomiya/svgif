import * as layer from '@/commons/models/layer'

describe('layer', () => {
  const getLayer = () => ({
    id: 1,
    createdAt: 'abc',
    from: 2,
    to: 2000,
    svgElementList: [{ id: 1, name: 'rectangle' }],
    svgElementUndoStack: [
      { type: 'ADD', svgElementList: [{ id: 1, name: 'rectangle' }] }
    ],
    svgElementRedoStack: [
      { type: 'ADD', svgElementList: [{ id: 1, name: 'rectangle' }] }
    ]
  })
  describe('getLayer レイヤーデータ取得', () => {
    it('初期値が入っていること', () => {
      const after = layer.getLayer({})
      expect(after.id).is.a('number')
      expect(after.createdAt).is.a('string')
      expect(after.from).is.a('number')
      expect(after.to).is.a('number')
      expect(after.svgElementList).to.have.lengthOf(0)
      expect(after.svgElementUndoStack).to.have.lengthOf(0)
      expect(after.svgElementRedoStack).to.have.lengthOf(0)
    })
    it('初期値を指定できること', () => {
      const after = layer.getLayer(getLayer())
      expect(after.id).to.equal(1)
      expect(after.createdAt).to.equal('abc')
      expect(after.from).to.equal(2)
      expect(after.to).to.equal(2000)
      expect(after.svgElementList).to.have.lengthOf(1)
      expect(after.svgElementUndoStack).to.have.lengthOf(1)
      expect(after.svgElementRedoStack).to.have.lengthOf(1)
    })
  })
  describe('completeLayer レイヤーデータ補完', () => {
    it('補完されること', () => {
      const after = layer.completeLayer({})
      expect(after.id).is.a('number')
      expect(after.createdAt).is.a('string')
      expect(after.from).is.a('number')
      expect(after.to).is.a('number')
      expect(after.svgElementList).to.have.lengthOf(0)
      expect(after.svgElementUndoStack).to.have.lengthOf(0)
      expect(after.svgElementRedoStack).to.have.lengthOf(0)
    })
    it('上書きはされないこと', () => {
      const after = layer.completeLayer(getLayer())
      expect(after.id).to.equal(1)
      expect(after.createdAt).to.equal('abc')
      expect(after.from).to.equal(2)
      expect(after.to).to.equal(2000)
      expect(after.svgElementList).to.have.lengthOf(1)
      expect(after.svgElementUndoStack).to.have.lengthOf(1)
      expect(after.svgElementRedoStack).to.have.lengthOf(1)
    })
  })
})

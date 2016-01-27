function range (n) {
  return Array.apply(null, Array(n)).map((_, i) => i)
}

function inc (x) { return x + 1 }

function isEven (x) { return x % 2 === 0 }

describe('A simple use of map and filter', () => {
  it('range generate a array', () => {
    expect([0, 1, 2]).toEqual(range(3))
  })

  it('A simple map function to increment', () => {
    expect([1, 2, 3]).toEqual(range(3).map(inc))
  })

  it('Map combine with filter', () => {
    expect([2, 4, 6]).toEqual(range(6).map(inc).filter(isEven))
  })

  it('map inc can be defined using reduce', () => {
    function mapIncReducer (list, x) {
      list.push(inc(x))
      return list
    }
    expect([1, 2, 3]).toEqual(range(3).reduce(mapIncReducer, []))
  })
})

function range (n) {
  return Array.apply(null, Array(n)).map((_, i) => i)
}

function inc (x) { return x + 1 }

function isEven (x) { return x % 2 === 0 }

function mapReduce (f) {
  return (list, x) => {
    return list.concat([f(x)])
  }
}

describe('A simple use of map, filter and reduce', () => {
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

describe('A general mapReduce abstraction can be used', () => {
  it('mapReduce with inc', () => {
    expect([1, 2, 3]).toEqual(range(3).reduce(mapReduce(inc), []))
  })

  it('mapReduce with anonimouos fucntions ', () => {
    expect([0, 1, 4]).toEqual(range(3).reduce(mapReduce((x) => x * x), []))
  })
})

describe('Filter can be implemented like reduce', () => {
  function filterIsEvenReducer (list, x) {
    if (x % 2 === 0) {
      return list.concat([x])
    }
    return list
  }
  it('Filter Even whit reduce', () => {
    expect([0, 2, 4]).toEqual(range(6).reduce(filterIsEvenReducer, []))
  })
})

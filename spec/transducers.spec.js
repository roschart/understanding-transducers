function range (n) {
  return Array.apply(null, Array(n)).map((_, i) => i)
}

function inc (x) { return x + 1 }

function isEven (x) { return x % 2 === 0 }

function mapReduce (transformation) {
  return (result, input) => {
    return result.concat([transformation(input)])
  }
}

function filterReduce (predicate) {
  return (result, input) => {
    return predicate(input)
      ? result.concat([input])
      : result
  }
}

function concat (result, input) {
  return result.concat([input])
}

function mapping (transformation) {
  return (reducer) => {
    return (result, input) => {
      return reducer(result, transformation(input))
    }
  }
}

function filtering (predicate) {
  return (reducer) => {
    return (result, input) => {
      return predicate(input)
        ? reducer(result, input)
        : result
    }
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
    function mapIncReducer (result, input) {
      result.push(inc(input))
      return result
    }
    expect([1, 2, 3]).toEqual(range(3).reduce(mapIncReducer, []))
  })
})

describe('A general mapReduce abstraction can be used', () => {
  it('mapReduce with inc', () => {
    expect([1, 2, 3]).toEqual(range(3).reduce(mapReduce(inc), []))
  })

  it('mapReduce with anonimouos fucntions ', () => {
    expect([0, 1, 4]).toEqual(range(3).reduce(mapReduce((input) => input * input), []))
  })
})

describe('Filter can be implemented like reduce', () => {
  function filterIsEvenReducer (result, input) {
    if (input % 2 === 0) {
      return result.concat([input])
    }
    return result
  }
  it('Filter Even whit reduce', () => {
    expect([0, 2, 4]).toEqual(range(6).reduce(filterIsEvenReducer, []))
  })
})

describe('A general filterReduce abstraction can be used', () => {
  it('filterReduce with even', () => {
    expect([0, 2, 4]).toEqual(range(5).reduce(filterReduce(isEven), []))
  })

  it('filterReduce with anonimouos fucntions ', () => {
    expect([3, 4]).toEqual(range(5).reduce(filterReduce((input) => input > 2), []))
  })
})

describe('mapReduce and filterReduce can be composed', () => {
  it('mapReduce inc and filterReduce even', () => {
    expect([2, 4, 6]).toEqual(range(6)
      .reduce(mapReduce(inc), [])
      .reduce(filterReduce(isEven), []))
  })
  it('inc and even', () => {
    expect([2, 4, 6]).toEqual(range(6)
      .map(inc)
      .filter(isEven))
  })
})

describe('mapReduce and filterReduce can be more abstracted', () => {
  it('mapping inc', () => {
    expect([1, 2, 3]).toEqual(range(3)
      .reduce(mapping(inc)(concat), []))
  })

  it('filtering even', () => {
    expect([0, 2, 4]).toEqual(range(6)
      .reduce(filtering(isEven)(concat), []))
  })

  it('compositon of mapping and filtering', () => {
    expect([2, 4, 6]).toEqual(range(6)
      .reduce(mapping(inc)(concat), [])
      .reduce(filtering(isEven)(concat), []))
  })

  describe('mapping and filtering are reducers', () => {
    it('mapping is a trasducer', () => {
      expect([2]).toEqual(mapping(inc)(concat)([], 1))
      expect([9, 3]).toEqual(mapping(inc)(concat)([9], 2))
    })
    it('filtering is a trasducer', () => {
      expect([2, 3]).toEqual(filtering(isEven)(concat)([2, 3], 5))
      expect([2, 3, 6]).toEqual(filtering(isEven)(concat)([2, 3], 6))
    })
  })
})

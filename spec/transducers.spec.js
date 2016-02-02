var t = require('../main.js')
const range = t.range
const inc = t.inc
const isEven = t.isEven
const mapReduce = t.mapReduce
const filterReduce = t.filterReduce
const concat = t.concat
const mapping = t.mapping
const filtering = t.filtering
const compose = t.compose

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
    it('mapping is a reducer', () => {
      expect([2]).toEqual(mapping(inc)(concat)([], 1))
      expect([9, 3]).toEqual(mapping(inc)(concat)([9], 2))
    })
    it('filtering is a reducer', () => {
      expect([2, 3]).toEqual(filtering(isEven)(concat)([2, 3], 5))
      expect([2, 3, 6]).toEqual(filtering(isEven)(concat)([2, 3], 6))
    })

    it('mapping and filtering can be composed', () => {
      expect([9]).toEqual(mapping(inc)(filtering(isEven)(concat))([9], 2))
      expect([9, 4]).toEqual(mapping(inc)(filtering(isEven)(concat))([9], 3))
    })

    it('composed with compose function', () => {
      const myLogic = compose(
        filtering(isEven)
        , filtering((input) => input < 10)
        , mapping((x) => x * x)
        , mapping(inc)
      )
      expect([1, 5, 17, 37, 65]).toEqual(range(10).reduce(myLogic(concat), []))
    })
  })
})

describe('Magic of transducers', () => {
  describe('A simple mapping', () => {
    it('With a normal concat', () => {
      expect([2]).toEqual(mapping(inc)(concat)([], 1))
    })
    it('The same logic with simple input', () => {
      expect(6).toEqual(mapping(inc)((_, i) => i)(null, 5))
    })
  })
  describe('A complex business logic', () => {
    const myLogic = compose(
      filtering(isEven)
      , filtering((input) => input < 10)
      , mapping((x) => x * x)
      , mapping(inc)
    )
    it('With a normal concat', () => {
      expect([5]).toEqual(myLogic(concat)([], 2))
    })
    it('The same business logic with simple input', () => {
      expect(5).toEqual(myLogic((_, i) => i)(null, 2))
    })
    it('The same business logic with a object', () => {
      expect({result: 5}).toEqual(myLogic((_, i) => { return {result: i} })(null, 2))
    })
    it('Business logic with reduce', () => {
      expect([5, 17]).toEqual([2, 4].reduce(myLogic(concat), []))
    })
    it('Business logic with two reduce', () => {
      expect(22).toEqual([2, 4]
        .reduce(myLogic(concat), [])
        .reduce((x, y) => x + y)
      )
    })
    it('Business logic with  reducer inline', () => {
      expect(22).toEqual([2, 3, 4].reduce(myLogic((x, y) => {
        return x + y
      }), 0))
    })
  })
})

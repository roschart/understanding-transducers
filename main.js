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

function compose () {
  const fns = arguments
  return (result) => {
    for (var i = fns.length - 1; i > -1; i--) {
      result = fns[i].call(this, result)
    }
    return result
  }
}

const myLogic = compose(
  filtering(isEven)
  , filtering((input) => input < 10)
  , mapping((x) => x * x)
  , mapping(inc)
)
console.log([2, 3, 4].reduce(myLogic((x, y) => { x + y }), 0))

module.exports = {
  range: range,
  inc: inc,
  isEven: isEven,
  mapReduce: mapReduce,
  filterReduce: filterReduce,
  concat: concat,
  mapping: mapping,
  filtering: filtering,
  compose: compose
}

import { flatten, size, map } from 'lodash'

import {
  isMate,
} from './lib'



const sequence = num => Array.from(Array(num), (nada, i) => i)



const swap = (x, y, [...xs]) => size(xs) > 1
 ? ([xs[x], xs[y]] = [xs[y], xs[x]], xs)
 : xs;



const rectGrid = params => {
  const { origin, cellSize, extents, flat } = params
  const x = sequence(extents.x)
  const y = sequence(extents.y)
  const nestedGrid = map(y, iY => map(x, iX => ({
    x: origin.x + (cellSize.x * iX),
    y: origin.y + (cellSize.y * iY),
  })
  ))
  if (flat) return flatten(nestedGrid)
  return nestedGrid
}



const end = arr => arr[size(arr) - 1]



const length = arr => size(arr)



const lastIndex = arr => size(arr) - 1



const getEdge = {
  top:    cell => cell.edgeMap[0],
  right:  cell => cell.edgeMap[1],
  bottom: cell => cell.edgeMap[2],
  left:   cell => cell.edgeMap[3],
}



const getCellTo = {
  left:   (matrix, rI, cI) => matrix[rI][cI - 1],
  right:  (matrix, rI, cI) => matrix[rI][cI + 1],
  above:  (matrix, rI, cI) => matrix[rI - 1][cI],
  below:  (matrix, rI, cI) => matrix[rI + 1][cI],
}



const isInBounds = {
  x:  (matrix, cI) => cI < lastIndex(matrix[0]),
  y: (matrix, rI) => rI < lastIndex(matrix),
}



const mmap = (arr, callback) => {
  return map(arr, (row, rI, wholeMatrix) => {
    return map(row, (cell, cI, wholeRow) => {
      return callback(cell, [rI, cI], wholeMatrix)
    })
  })
}



const transpose = matrix => map(matrix[0], (x,i) => map(matrix, x => x[i]))



const isFirstIdx = i => i === 0



const isLastIdx = (arr, i) => i === lastIndex(arr)



const partition = avatar => {
  const horizontal = grainPartition(avatar.matrix)
  // const twoByTwos = horizontal.forEach((row, rI) => {
  // })

  const vertical = grainPartition(transpose(avatar.matrix))

  return {
    horizontal,
    vertical,
  }
}



const multisplice = (arr, indices) => map(indices, (startI, i) => arr.slice(startI, indices[i + 1]))




const sort = (arr, comparator, key) => arr.sort((a, b) => comparator(a, b, key))



const rotate = (a, n) => [...a.slice(n, size(a)), a.slice(0, n)]



const scan = m => {
  return [
       m[0][0], m[0][1], m[1][0], m[1][1],
       m[0][2], m[0][3], m[1][2], m[1][3],
       m[2][0], m[2][1], m[3][0], m[3][1],
       m[2][2], m[2][3], m[3][2], m[3][3],
  ]
}



const arrEq = (a, b) => size(a) === size(b)
  ? a.every((v, i) => v === b[i])
  : false


// this could use reduce or just a for loop
const grainPartition = matrix => {
  let sequences = []
  matrix.forEach((row, rI) => {

    let rowBreaks = []
    row.forEach((cell, cI) => {

      // append the start idx at the start of each row loop
      if (isFirstIdx(cI)) rowBreaks = [...rowBreaks, 0]
      if (isInBounds.x(matrix, cI)) {
        const cellToRight = getCellTo.right(matrix, rI, cI)
        const thisRightEdge = getEdge.right(cell)
        const thatLeftEdge = getEdge.left(cellToRight)
        if (!isMate(thisRightEdge, thatLeftEdge)) {
          // append the start index of the next mate sequence
          rowBreaks = [...rowBreaks, cI + 1]
        }
      }
    })

    sequences = [...sequences, multisplice(row, rowBreaks)]
  })

  return sequences
}

export {
  sequence,
  swap,
  end,
  length,
  lastIndex,
  getEdge,
  getCellTo,
  isInBounds,
  mmap,
  transpose,
  isFirstIdx,
  isLastIdx,
  partition,
  multisplice,
  sort,
  rotate,
  scan,
  arrEq,
  grainPartition,
  rectGrid,
}

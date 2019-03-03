import { pour, PlainSVGStringRenderer } from '../dist/bundle'
import sylgraph from '../src/lib/sylgraph.json'
import dirs from '../dirs.json'
import fs from 'fs'
test('converts zod', () => {

  // savePieces()

  // savePiecesInJSON()

  // saveSVG()

});

function saveSVG() {
  let patp = '';
  Object.keys(dirs).forEach((v) => {
    patp += dirs[v][0]
  })
  console.log(patp)
  const r = pour({
    patp,
    renderer: undefined,
    size: 128
  });
  const data = PlainSVGStringRenderer.svg(r)
  fs.writeFile('./test.svg', data, function(err, data) {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
}

function savePiecesInJSON() {
  const DIRS = ['NW', 'NE', 'SW', 'SE']
  const ROUND = './svgs/ROUND/'
  let printable = {}
  DIRS.forEach((v, i) => {
    const path = ROUND + v
    const items = fs.readdirSync(path)
    printable[v] = items.filter(i => i !== '.DS_Store').map(i => i.split('.')[0])
  })
  fs.writeFile('./dirs.json', JSON.stringify(printable), function(err, data) {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });
}

function savePieces() {
  Object.keys(sylgraph.mapping).forEach((v, i) => {
    const r = pour({
      patp: v,
      renderer: undefined,
      size: 128
    });
    const data = PlainSVGStringRenderer.svg(r)
    fs.writeFile('./svgs/' + v + ".svg", data, function(err, data) {
      if (err) console.log(err);
      console.log("Successfully Written to File.");
    });
  })
}
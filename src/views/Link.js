import React, { Component } from 'react'

import ReactSVGComponents from '../renderers/ReactSVGComponents'
import { pour } from '../lib/pour'
import { pull, fan } from '../lib/lung'
import { map, filter, forEach, reduce, chunk,shuffle, isString, get } from 'lodash'
import fileDownload from 'js-file-download'
import omitEmpty from 'omit-empty'
import {
  lastIndex,
  len,
  isAtEnd,
  isAtStart,
  seq,
  isEmpty,
  dupes
} from '../lib/lib.array'

import {
  prefixesSorted,
  suffixesSorted,
  zippedAll,
  sylSort,
} from '../lib/scope'

import { suffixes, prefixes } from '../lib/lib.urbit'

import {
  values,
  keys,
  entries,
} from '../lib/lib'

class Link extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lam: [],
      flat: [],
      dictionary: [],
      reference: null,
      selectedSymbolIndex: 0,
      pairedSymbolIndexes: [],
      selectedSyllableName: 'nada',
      pairedSyllableNames: [],
    }
  }

  componentDidMount = () => {
    window.addEventListener('keydown', e => {
      if (e.keyCode === 13) this.pair()
    })
    const dictionary = {
      suffixes: sylSort(suffixesSorted),
      prefixes: sylSort(prefixesSorted),
    }

    const flat = reduce([...dictionary.suffixes, ...dictionary.prefixes], (acc, item) => {
      return [...acc, ...item.members]
    }, [])

    pull((reference) => {
      const lam = fan(reference)
      this.setState({
        pairedSymbolIndexes: map(filter(values(localStorage), item => isString(item)), s => parseInt(s)),
        pairedSyllableNames: filter(keys(localStorage), item => item !== 'length'),
        dictionary,
        flat,
        reference,
        lam: lam })

        // example manual interfaces
        // localStorage.setItem('fal', '8')
        // localStorage.remove('')
        // delete ls.nada
        // localStorage.removeItem('nada')
        //
        const ls = {...localStorage}


        const missingKeys = filter([...suffixes, ...prefixes], syl => !keys(ls).includes(syl))

        const keyDupes = dupes(keys(ls))
        const valDupes = dupes(values(ls))


        console.log(len(keys(ls)), missingKeys, ls.nada, ls.length, keyDupes, valDupes )

        const mapping = reduce(entries(ls), (acc, [key, value]) => {
          acc[key] = lam[value]
          return acc
        }, {})





        const compressionManager = (sylmap) => {
          let ref = 0
          let refs = []
          let refIndex = 0
          const compress = (child) => {
            if (child.tag === 'path') {

              const d = child.attr.d
              // let refToSet = 0
              if (refs.indexOf(d) === -1) {

                refIndex = ref
                refs = refs.concat(d)
                ref = ref + 1
              } else {
                refIndex = refs.indexOf(d)
              }

              return {
                ...child,
                attr: { ...child.attr, d: refIndex },
                children: map(get(child, 'children', []), child => compress(child)),
              }
            } else {
              return {
                ...child,
                children: map(get(child, 'children', []), child => compress(child)),
              }
            }
          }

          const newMapping = reduce(entries(ls), (acc, [key, value]) => {
            acc[key] = compress(lam[value])
            return acc
          }, {})

          console.log(refs)
          return {
            refs,
            mapping: newMapping,
          }
        }



        // console.log(compressionManager(mapping))


        fileDownload(JSON.stringify(omitEmpty(compressionManager(mapping))), 'sylmap.json')
    })



  }

  pair = () => {
    const {
      selectedSyllable,
      lam,
      selectedSymbolIndex,
      selectedSyllableName,
      pairedSyllableNames,
      pairedSymbolIndexes,
    } = this.state
    localStorage.setItem(`${selectedSyllableName}`, selectedSymbolIndex)
    console.log(localStorage, this.state)
    this.setState({
      selectedSymbolIndex: -1,
      selectedSyllableName: 'nada',
      pairedSyllableNames: [...pairedSyllableNames, selectedSyllableName],
      pairedSymbolIndexes: [...pairedSymbolIndexes, selectedSymbolIndex],
    })
  }

  clearAll = () => {
    localStorage.clear()
    this.setState({
      pairedSyllableNames: [],
      pairedSymbolIndexes: []
    })
  }

  exportSylmap = () => {
    // const filtered = filter(entries(localStorage),
    // map(entries(localStorage))
    // return
  }

  // unPair = (syl) => {
  //   const {
  //     selectedSyllable,
  //     reference,
  //     selectedSymbolIndex,
  //     selectedSyllableName,
  //     pairedSyllableNames,
  //     pairedSymbolIndexes,
  //   } = this.state
  //   localStorage.removeItem(`${syl}`)
  //   console.log(localStorage)
  //   indexOf(syl)
  //   remove(pairedSyllableNames, item => )
  //   this.setState({
  //
  //   })
  //
  // }


  render = () => {
    const {
      lam,
      flat,
      selectedSymbolIndex,
      pairedSymbolIndexes,
      pairedSyllableNames,
      selectedSyllableName,
      dictionary,
    } = this.state

    return [
      <nav>
      <button onClick={() => this.pair()}>{'Pair'}</button>
      <button onClick={() => this.exportSylmap()}>{'Export'}</button>

      {
        // <button onClick={() => this.clearAll()}>{'CLEAR ALL'}</button>
      }
      </nav>,
      <div className={'grid'}>
        <section className={'a flex'}>
          {
            map(lam, (symbol, i) =>
              <Sym
                key={`symbol-${i}`}
                index={i}
                symbol={symbol}
                isSelected={i === selectedSymbolIndex}
                isPaired={pairedSymbolIndexes.includes(i)}
                select={() => this.setState({selectedSymbolIndex: i})}
              /> )
          }
        </section>

        <section className={'b flex-v'}>
        <SylCategory
          title={'Suffixes'}
          payload={dictionary.suffixes}
          selectedSyllableName={selectedSyllableName}
          pairedSyllableNames={pairedSyllableNames}
          select={(name) => this.setState({selectedSyllableName: name})}
          />
          <SylCategory
            title={'Prefixes'}
            payload={dictionary.prefixes}
            selectedSyllableName={selectedSyllableName}
            pairedSyllableNames={pairedSyllableNames}
            select={(name) => this.setState({selectedSyllableName: name})}
            />


        </section>
      </div>
    ]
  }
}


const SylCategory = ({
    title,
    payload,
    select,
    pairedSyllableNames,
    selectedSyllableName
  }) => {
  let idx = -1
  return (
    <div>
      <h1>{title}</h1>
      {
        map(payload, item => {
          return <div className={'mt-1 bb'}>
            {
              map(item.members, member => {
                idx++
                return <Syl
                  index={idx}
                  syllable={member}
                  select={select}
                  isPaired={pairedSyllableNames.includes(member)}
                  isSelected={member === selectedSyllableName}
                  />

              })
            }
          </div>
        })
      }
  </div>
  )
}


class Sym extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render = () => {
    const { index, isPaired, symbol, isSelected, select} = this.props


    let colorWay = isSelected ? ['#fff', '#4330FC'] : ['#fff', '#000']
    colorWay = isPaired ? ['#fff', '#FF4C25'] : colorWay

    return (
      <div
        className={'hp'}
        onClick={() => select()}>
      {
        pour({
          symbols: [symbol],
          renderer: ReactSVGComponents,
          size: 96,
          colorway: colorWay,
        })
      }
      </div>
    )
  }
}





class Syl extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render = () => {
    const { syllable, select, isSelected, isPaired, index } = this.props

    let className = isSelected ? 'blue-fill hp mono' : 'black-fill hp mono'
    className = isPaired ? 'orange-fill hp mono' : className

    return (
      <button
        onClick={() => select(syllable)}
        className={className}>
      {syllable}
      </button>
    )
  }
}



export default Link

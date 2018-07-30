# Urbit Seals
[Github](https://github.com/urbit/avatars)

## Overview
In production, this repo is a library that exposes two items: `pour()` and `sylmap`. `pour()` is a function that generates an object representation of an SVG seal. `sylmap` is a mapping between syllables and symbols stored in JSON. The library requires a third component called a renderer, which takes the output of `pour()` and translates it into DOM nodes. In development, this repo also contains a pipeline of tools that assist in the design of combinatorial symbols.

**Cannot accept moons or comets.**


![how this works diagram](https://github.com/urbit/avatars/blob/master/docs/high-level-flow.png?raw=true)

## Usage

 1. `npm install`
 2. `npm run build`
 3. the built `pour()` library will be in `build/static/js/`
 4. Use a renderer based on `src/ReactSVGComponents.js`
 5. Import `pour` and `sylmap` from the built lib


### Example

 ```js
 import { pour, sylmap } from 'seals'
 import ReactSVGComponents from 'ReactSVGComponents'

 <div> {
   pour({
     patp: 'zod',
     sylmap: sylmap,
     renderer: ReactSVGComponents,
     size: 128,
   })
 } </div>

 ```

## `Pour()`
### Params
|Param     | Explanation                                                                                    | Type                                                | optional?
| ---------| -----------------------------------------------------------------------------------------------|-----------------------------------------------------|------------------------|
|`patp`      | any valid urbit patp                                                                             | `string` or `array` of form `['syl', 'syl', ...]`   | No, and can only accept galaxies, stars and planets.
|`sylmap`    | a mapping between syllables and symbols                                                        | `object` or `JSON`                                  | Yes, will return default symbols if no `sylmap` provided
|`renderer`  | an object with methods that transform the output of svg object representation output of pour() | `object` with methods                               | Yes, will return POJO svg representation if no `renderer` provided
|`size`      | width and height of final output                                                               | `integer`                                           | Yes, will default to 256px without `size` provided
|`colorway`      | a consistent colorscheme that ignores internal color method                                | `array` of form `[#background, #foreground]`                                           | Yes, will default to internal `dye()` method without `colorway` provided
|`symbols`      | overrides patp and sylmap. Used for rendering lists of symbols regardless of assignment.     | `array` of form `[symbol, ...]`                  | Yes, only used in symbol  development thus far.



### Designing symbols
  Send me smoke signals.

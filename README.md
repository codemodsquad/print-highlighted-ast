# print-highlighted-ast

[![CircleCI](https://circleci.com/gh/codemodsquad/print-highlighted-ast.svg?style=svg)](https://circleci.com/gh/codemodsquad/print-highlighted-ast)
[![Coverage Status](https://codecov.io/gh/codemodsquad/print-highlighted-ast/branch/master/graph/badge.svg)](https://codecov.io/gh/codemodsquad/print-highlighted-ast)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/print-highlighted-ast.svg)](https://badge.fury.io/js/print-highlighted-ast)

print a babel AST with specific nodes highlighted, for debugging codemods

# Example

## Script

```ts
import printHighlightedAst from 'print-highlighted-ast'
import { parse } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import chalk from 'chalk'

const code = `
const foo = () => 2
const bar = 500 + 600
`
const ast = parse(code)
const highlights: Array<[NodePath<any>, (code: string) => string]> = []
traverse(ast, {
  NumericLiteral: path => {
    highlights.push([path, chalk.bgBlue])
  },
})

console.log(printHighlightedAst(code, { highlights })
```

## Output

<code>
const foo = () => <span style="background-color: blue;">2</span><br />
const bar = <span style="background-color: blue;">500</span> + <span style="background-color: blue;">600</span>
<code>

# API

You can pass the source code or a parsed AST as the first argument. If you pass an AST it will be
converted to code with `@babel/generator`.

Each element of `highlights` is a tuple of `[0]` path you want to highlight, `[1]` highlighting function.
You can pass options to `@babel/parser` and `@babel/generator` as shown below.

The code will be parsed with `@babel/parser` to determine the source range of the paths you want to
highlight. If you're using language extensions like Flow, Typescript, or JSX, you'll need to pass
those plugins in `parseOptions`.

```ts
import { Node } from '@babel/types'
import { NodePath } from '@babel/traverse'
import generate from '@babel/generator'
import { parse } from '@babel/parser'

function printHighlightedAst(
  codeOrAst: string | Node,
  {
    highlights,
    generateOptions,
    parseOptions,
  }: {
    highlights: Iterable<[NodePath<any>, (code: string) => string]>
    generateOptions?: Parameters<typeof generate>[1]
    parseOptions?: Parameters<typeof parse>[1]
  }
): string
```

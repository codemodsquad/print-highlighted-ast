/* eslint-env mocha */

import printHighlightedAst from './'
import { parse } from '@babel/parser'
import { expect } from 'chai'
import traverse, { NodePath } from '@babel/traverse'
import chalk from 'chalk'

describe('printHighlightedAst', () => {
  it('passing code', () => {
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

    expect(printHighlightedAst(code, { highlights })).to.equal(chalk`
    const foo = () => {bgBlue 2}
    const bar = {bgBlue 500} + {bgBlue 600}
    `)
  })
  it('passing ast', () => {
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

    expect(printHighlightedAst(ast, { highlights })).to
      .equal(chalk`const foo = () => {bgBlue 2};

const bar = {bgBlue 500} + {bgBlue 600};`)
  })
})

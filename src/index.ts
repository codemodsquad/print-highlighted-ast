import { Node } from '@babel/types'
import { NodePath } from '@babel/traverse'
import generate from '@babel/generator'
import { parse } from '@babel/parser'
import get from 'lodash/get'

function getPathKeys(path: NodePath<any>): Array<string | number> {
  const result: Array<string | number> = []
  while (path) {
    result.push(path.key)
    if (path.parentKey && path.parentKey !== path.key)
      result.push(path.parentKey)
    path = path.parentPath
  }
  return result.reverse()
}

function transformRange(
  code: string,
  start: number,
  end: number,
  transform: (code: string) => string
): string {
  return `${code.substring(0, start)}${transform(
    code.substring(start, end)
  )}${code.substring(end)}`
}

export default function printHighlightedAst(
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
): string {
  const convertedHighlights: Array<[
    Array<string | number>,
    (code: string) => string
  ]> = [...highlights]
    .sort(([a], [b]): number => {
      const aIndex = a.node.start
      const bIndex = b.node.start
      // descending order
      return aIndex > bIndex ? -1 : aIndex < bIndex ? 1 : 0
    })
    .map(([path, highlighter]) => [getPathKeys(path), highlighter])
  let printed =
    typeof codeOrAst === 'string'
      ? codeOrAst
      : generate(codeOrAst as any, generateOptions).code
  const reparsed = parse(printed, parseOptions)
  for (const [pathKeys, highlight] of convertedHighlights) {
    const node = get(reparsed, pathKeys)
    if (!node) continue
    const { start, end } = node
    if (start == null || end == null) continue
    printed = transformRange(printed, start, end, highlight)
  }
  return printed
}

import type { CreateApp } from '../runtime-core'
import { createRenderer } from '../runtime-core'
import { isOn } from '../shared'

type CreateElement = (type: string) => Element
const createElement: CreateElement = (type) => {
  return document.createElement(type)
}

type PatchProps = (elm: Element, attr: string, val: any) => void
const patchProps: PatchProps = (element, attr, val) => {
  if (isOn(attr)) {
    element.addEventListener(attr.substring(2).toLowerCase(), val)
  } else {
    element.setAttribute(attr, val)
  }
}

type Insert = (child: Element, parent: Element) => void
const insert: Insert = (child, parent) => {
  parent.appendChild(child)
}

type FindElement = (rootStr: string | Element) => Element | never
const findElement: FindElement = (rootStr: string | Element): Element | never => {
  if (typeof rootStr === 'string') {
    const elm = document.querySelector(rootStr)
    if (!elm) throw new TypeError('Mounte method need a Element!')

    return elm
  } else {
    return rootStr
  }
}

const _createApp = createRenderer({
  createElement,
  patchProps,
  insert,
  findElement
})

export const createApp: CreateApp = (...args) => {
  return _createApp(...args)
}

export * from '../runtime-core'

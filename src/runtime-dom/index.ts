import type { CreateApp } from '../runtime-core'
import { createRenderer } from '../runtime-core'
import { isOn } from '../shared'

type CreateElement = (type: string) => Element
const createElement: CreateElement = (type) => {
  return document.createElement(type)
}

type PatchProps = (elm: Element, attr: string, prevVal: any, nextVal: any) => void
const patchProps: PatchProps = (element, attr, prevVal, nextVal) => {
  if (isOn(attr)) {
    element.addEventListener(attr.substring(2).toLowerCase(), nextVal)
  } else {
    if (nextVal === undefined || nextVal === null) {
      element.removeAttribute(attr)
    } else {
      element.setAttribute(attr, nextVal)
    }
  }
}

type Insert = (child: Element, parent: Element) => void
const insert: Insert = (child, parent) => {
  parent.appendChild(child)
}

type Remove = (child: Element) => void
const remove: Remove = (child) => {
  const parent = child?.parentNode

  if (parent) {
    parent.removeChild(child)
  }
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

type SetElementText = (el: Element, text: string) => void
const setElementText: SetElementText = (el, text) => {
  el.textContent = text
}

const _createApp = createRenderer({
  createElement,
  patchProps,
  insert,
  remove,
  findElement,
  setElementText,
})

export const createApp: CreateApp = (...args) => {
  return _createApp(...args)
}

export * from '../runtime-core'


import { isObject } from '../shared'
import { ShapeFlags } from '../shared/shapeFlags'
import { ComponentInstance, createComponentInstance, setupComponent } from './component'
import { CreateApp, createAppAPI } from './createApp'
import type { VNode } from './vnode'
import { Component, Fragment, Text } from './vnode'

export type Renderer = (vnode: VNode, container: Container, parentInstance?: ComponentInstance) => void
type Container = Element
type ElementNode = VNode & { type: string }

interface CreateRenderOption<E = Element> {
  createElement(type: string): E
  patchProps(elm: E, attr: string, val: any): void
  insert(child: E, parent: E): void
  findElement(type: string | E): E
}

export type CreateRenderer<T = Element> = (options: CreateRenderOption<T>) => CreateApp
export const createRenderer: CreateRenderer = (options) => {
  const {
    createElement,
    patchProps,
    insert,
    findElement
  } = options

  const renderer: Renderer = (vnode, container, parentInstance) => {
    // patch 
    patch(vnode, container, parentInstance)
  }

  type Patch = (node: VNode | ElementNode, container: Container, parentInstance?: ComponentInstance) => void
  const patch: Patch = (vnode, container, parentInstance) => {
    const { type, shapeFlags } = vnode
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentInstance)
        break;
      case Text:
        processText(vnode, container)
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          // if element -> mount the element to view
          processElement(vnode as ElementNode, container, parentInstance)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          // if vnode -> process the vnode 
          processComponent(vnode, container, parentInstance)
        }
    }
  }

  type ProcessComponent = (vnode: VNode, container: Container, parentInstance?: ComponentInstance) => void
  const processComponent: ProcessComponent = (vnode, container, parentInstance) => {
    mountComponent(vnode, container, parentInstance)
  }

  type MountComponent = (initialVnode: VNode, container: Container, parentInstance?: ComponentInstance) => void
  const mountComponent: MountComponent = (initialVnode, container, parentInstance) => {
    const instance = createComponentInstance(initialVnode, parentInstance)

    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
  }


  type SetupRenderEffect = (instance: ComponentInstance, initialVnode: VNode, container: Container) => void
  const setupRenderEffect: SetupRenderEffect = (instance, initialVnode, container) => {
    const subTree = (instance.type as Component)?.render?.call(instance.proxy) as VNode
    // vnode -> patch => dom ,mounted the root component

    patch(subTree, container, instance)
    initialVnode.el = subTree.el
  }

  type ProcessFragment = (vnode: VNode, container: Container, parentInstance?: ComponentInstance) => void
  const processFragment: ProcessFragment = (vnode, container, parentInstance) => {
    mountChildren(vnode, container, parentInstance)
  }

  type ProcessText = (vnode: VNode, container: Container) => void
  const processText: ProcessText = (vnode, container) => {
    const { children } = vnode
    const textNode = vnode.el = document.createTextNode(children as string)
    container.append(textNode)
  }

  type ProcessElement = (vnode: ElementNode, container: Container, parentInstance?: ComponentInstance) => void
  const processElement: ProcessElement = (vnode, contaner, parentInstance) => {
    mountElement(vnode, contaner, parentInstance)
  }

  type MountElemet = (vnode: ElementNode, container: Container, parentInstance?: ComponentInstance) => void
  const mountElement: MountElemet = (vnode, container, parentInstance) => {
    const { type, props = {} } = vnode
    const element = vnode.el = createElement(type)

    if (isObject(props)) {

      for (const attr of Object.keys(props!)) {
        patchProps(element, attr, props[attr])
      }
    }

    mountChildren(vnode, element, parentInstance)

    insert(element, container)
  }

  type MountChildren = (vnode: VNode, container: Container, parentInstance?: ComponentInstance) => void
  const mountChildren: MountChildren = (vnode, container, parentInstance) => {
    const { shapeFlags, children } = vnode
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      container.textContent = String(children)
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      (children as VNode[]).forEach((node) => {
        patch(node, container, parentInstance)
      })
    }
  }

  return createAppAPI(renderer, findElement)
}


import { effect } from '../reactivity'
import { EMPTY_OBJ, isObject } from '../shared'
import { ShapeFlags } from '../shared/shapeFlags'
import { ComponentInstance, createComponentInstance, setupComponent } from './component'
import { CreateApp, createAppAPI } from './createApp'
import type { Children, Props, VNode } from './vnode'
import { Component, Fragment, Text } from './vnode'

export type Renderer = (vnode: VNode, container: Container, parentInstance: ComponentInstance) => void
type Container = Element
type ElementNode = VNode & { type: string }

interface CreateRenderOption<E = Element> {
  createElement(type: string): E
  patchProps(elm: E, attr: string, prevVal: any, nextVal: any): void
  insert(child: E, parent: E): void
  remove(child: E): void
  setElementText(elm: E, text: string): void
  findElement(type: string | E): E
}

export type CreateRenderer<T = Element> = (options: CreateRenderOption<T>) => CreateApp
export const createRenderer: CreateRenderer = (options) => {
  const {
    createElement: hostCreateElement,
    patchProps: hostPatchProps,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    findElement: hostFindElement
  } = options

  const renderer: Renderer = (vnode, container, parentInstance) => {
    // patch 
    patch(null, vnode, container, parentInstance)
  }

  type Patch = (n1: VNode | ElementNode | null, n2: VNode | ElementNode, container: Container, parentInstance: ComponentInstance) => void
  const patch: Patch = (n1, n2, container, parentInstance) => {
    const { type, shapeFlags } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentInstance)
        break;
      case Text:
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          // if element -> mount the element to view
          processElement(n1 as ElementNode, n2 as ElementNode, container, parentInstance)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          // if vnode -> process the vnode 
          processComponent(n2, container, parentInstance)
        }
    }
  }

  type ProcessComponent = (vnode: VNode, container: Container, parentInstance: ComponentInstance) => void
  const processComponent: ProcessComponent = (vnode, container, parentInstance) => {
    mountComponent(vnode, container, parentInstance)
  }

  type MountComponent = (initialVnode: VNode, container: Container, parentInstance: ComponentInstance) => void
  const mountComponent: MountComponent = (initialVnode, container, parentInstance) => {
    const instance = createComponentInstance(initialVnode, parentInstance)

    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
  }


  type SetupRenderEffect = (instance: ComponentInstance, initialVnode: VNode, container: Container) => void
  const setupRenderEffect: SetupRenderEffect = (instance, initialVnode, container) => {
    effect(() => {
      if (!instance.isMounted) {
        const subTree = (instance.subTree = (instance.type as Component)?.render?.call(instance.proxy) as VNode)
        console.log('🤔 ~ file: renderer.ts:74 ~ effect ~ subTree', subTree)
        // vnode -> patch => dom ,mounted the root component

        patch(null, subTree, container, instance)
        initialVnode.el = subTree.el
        instance.isMounted = true
      } else {
        const preSubTree = instance.subTree!
        console.log('🤔 ~ file: renderer.ts:81 ~ effect ~ preSubTree', preSubTree)
        const nextSubTree = (instance.subTree = (instance.type as Component)!.render!.call(instance.proxy))
        nextSubTree.el = preSubTree.el
        console.log('🤔 ~ file: renderer.ts:83 ~ effect ~ nextSubTree', nextSubTree)

        patch(preSubTree, nextSubTree, container, instance)
      }
    })
  }

  type ProcessFragment = (n1: VNode | null, n2: VNode, container: Container, parentInstance: ComponentInstance) => void
  const processFragment: ProcessFragment = (n1, n2, container, parentInstance) => {
    mountChildren(n2.children as Children, container, parentInstance)
  }

  type ProcessText = (n1: VNode | null, n2: VNode, container: Container) => void
  const processText: ProcessText = (n1, n2, container) => {
    const { children } = n2
    const textNode = document.createTextNode(children as string)
    container.append(textNode)
  }

  type ProcessElement = (n1: ElementNode, n2: ElementNode, container: Container, parentInstance: ComponentInstance) => void
  const processElement: ProcessElement = (n1, n2, container, parentInstance) => {
    if (!n1) {
      mountElement(n2, container, parentInstance)
    } else {
      patchElement(n1, n2, container, parentInstance)
    }
  }

  type PatchElement = (n1: ElementNode, n2: ElementNode, container: Container, parentInstance: ComponentInstance) => void
  const patchElement: PatchElement = (n1, n2, container, parentInstance) => {
    console.log('🤔 ~ file: renderer.ts:114 ~ patchElement ~ n1, n2, container', n1, n2, container)

    const oldProps = n1.props ?? EMPTY_OBJ
    const newProps = n2.props ?? EMPTY_OBJ

    patchChildren(n1, n2, container, parentInstance)
    patchProps(n2.el!, oldProps, newProps)
  }

  type PatchChildren = (n1: ElementNode, n2: ElementNode, container: Container, parentInstance: ComponentInstance) => void
  const patchChildren: PatchChildren = (n1, n2, container, parentInstance) => {
    const prevShapeFlag = n1.shapeFlags
    const c1 = n1.children
    const nextShapeFlag = n2.shapeFlags
    const c2 = n2.children

    if (nextShapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // handle n1's Array type children then n2's children is text type 
        unmountChildren(n1.children as Children)
      }

      if (c1 !== c2) {
        // handle n1's children type and n2's chidlren type are text string
        // or handle case that n1's children is Array but n2's children is text type
        hostSetElementText(n2.el!, c2 as string)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // handle n1's children is Text then n2's children is Array of component
        hostSetElementText(n2.el!, '')
        mountChildren(n2.children as Children, container, parentInstance)
      } else {
        // hadnle both n1's children and n2's children are array
        // FIXME: implement diff method refactor the flow code
        // easy mode:
        unmountChildren(n1.children as Children)
        mountChildren(n2.children as Children, container, parentInstance)
      }
    }



  }

  type UnmountChildren = (children: Children) => void
  const unmountChildren: UnmountChildren = (children) => {
    (children as Array<VNode>).forEach((item) => {
      if (item.el) {
        hostRemove(item.el)
      }
    })

  }

  type PatchProps = (el: Element, oldProps: Props, newProps: Props) => void
  const patchProps: PatchProps = (el, oldProps, newProps) => {
    if (oldProps === newProps) return

    for (const key in newProps) {
      const prevProp = oldProps[key]
      const nextProp = newProps[key]

      if (prevProp !== nextProp) {
        hostPatchProps(el, key, prevProp, nextProp)
      }
    }

    if (oldProps === EMPTY_OBJ) return

    for (const key in oldProps) {
      if (!(key in newProps)) {
        hostPatchProps(el, key, oldProps[key], null)
      }
    }
  }

  type MountElemet = (n2: ElementNode, container: Container, parentInstance: ComponentInstance) => void
  const mountElement: MountElemet = (n2, container, parentInstance) => {
    const { type, props = {} } = n2
    const element = n2.el = hostCreateElement(type)

    if (isObject(props)) {
      for (const attr of Object.keys(props!)) {
        hostPatchProps(element, attr, null, props[attr])
      }
    }

    mountChildren(n2.children as Children, element, parentInstance)
    hostInsert(element, container)
  }

  type MountChildren = (children: Children, container: Container, parentInstance: ComponentInstance) => void
  const mountChildren: MountChildren = (children, container, parentInstance) => {
    if (!children) return
    if (typeof children === 'string') {
      hostSetElementText(container, children)
    } else {
      children.forEach((v) => {
        patch(null, v, container, parentInstance)
      })
    }
  }

  return createAppAPI(renderer, hostFindElement)
}


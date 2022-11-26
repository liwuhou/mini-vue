import { createComponentInstance, setupComponent } from './index'
import type { VNode } from './index'
import { ComponentInstance } from './component'
import { Component } from './vnode'
import { createElement } from './dom'
import { isArray, isObject } from '../shared/index'

type Container = Element
type ElementNode = VNode & { type: string }
export type Render = (vnode: VNode, container: Container) => void
export const render: Render = (vnode, container) => {
    // patch 
    patch(vnode, container)
}

type Patch = (node: VNode | ElementNode, container: Container) => void
const patch: Patch = (vnode, container) => {
    console.log('🤔 ~ file: render.ts ~ line 15 ~ vnode', vnode)
    if (typeof vnode.type === 'string') {
        // if element -> mount the element to view
        processElement(vnode as ElementNode, container)
    } else if (isObject(vnode.type)) {
        // if vnode -> process the vnode 
        processComponent(vnode, container)
    }

    // TODO: mount element

}

type ProcessComponent = (vnode: VNode, container: Container) => void
const processComponent: ProcessComponent = (vnode, container) => {
    mountComponent(vnode, container)
}

type MountComponent = (initialVnode: VNode, container: Container) => void
const mountComponent: MountComponent = (initialVnode, container) => {
    const instance = createComponentInstance(initialVnode)

    setupComponent(instance)
    setupRenderEffect(instance, initialVnode, container)
}


type SetupRenderEffect = (instance: ComponentInstance, initialVnode: VNode, container: Container) => void
const setupRenderEffect: SetupRenderEffect = (instance, initialVnode, container) => {
    const subTree = (instance.type as Component)?.render?.call(instance.proxy) as VNode // FIXME: Text type will to do something
    // vnode -> patch => dom ,mounted the root component

    patch(subTree, container)
    initialVnode.el = subTree.el
}

type ProcessElement = (vnode: ElementNode, container: Container) => void
const processElement: ProcessElement = (vnode, contaner) => {
    mountElement(vnode, contaner)
}

type MountElemet = (vnode: ElementNode, container: Container) => void
const mountElement: MountElemet = (vnode, container) => {
    const { type, props, children } = vnode
    const element = vnode.el = createElement(type)

    if (isObject(props)) {
        for (const attr of Object.keys(props!)) {
            element.setAttribute(attr, props![attr])
        }
    }
    if (isArray(children)) {
        (children as VNode[]).forEach((node) => {
            patch(node, element)
        })
    } else if (typeof children === 'string') {
        element.textContent = children
    }

    container.append(element)

}
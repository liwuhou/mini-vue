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

type MountComponent = (vnode: VNode, container: Container) => void
const mountComponent: MountComponent = (vnode, container) => {
    const instance = createComponentInstance(vnode)

    setupComponent(instance)
    setupRenderEffect(instance, container)
}


type SetupRenderEffect = (instance: ComponentInstance, container: Container) => void
const setupRenderEffect: SetupRenderEffect = (instance, container) => {
    const subTree = (instance.type as Component)?.render?.call(instance.setupState) as VNode // FIXME: Text type will to do something
    // vnode -> patch => dom ,mounted the root component

    patch(subTree, container)
}

type ProcessElement = (vnode: ElementNode, container: Container) => void
const processElement: ProcessElement = (vnode, contaner) => {
    debugger
    mountElement(vnode, contaner)
}

type MountElemet = (vnode: ElementNode, container: Container) => void
const mountElement: MountElemet = (vnode, container) => {
    const { type, props, children } = vnode
    const element = createElement(type)

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
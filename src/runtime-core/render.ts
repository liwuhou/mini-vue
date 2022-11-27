import { createComponentInstance, setupComponent } from './index'
import type { VNode } from './index'
import { ComponentInstance } from './component'
import { Component } from './vnode'
import { createElement } from './dom'
import { isArray, isObject, isOn } from '../shared/index'
import { ShapeFlags } from '../shared/shapeFlags'

type Container = Element
type ElementNode = VNode & { type: string }
export type Render = (vnode: VNode, container: Container) => void
export const render: Render = (vnode, container) => {
    // patch 
    patch(vnode, container)
}

type Patch = (node: VNode | ElementNode, container: Container) => void
const patch: Patch = (vnode, container) => {
    const { shapeFlags } = vnode
    if (shapeFlags & ShapeFlags.ELEMENT) {
        // if element -> mount the element to view
        processElement(vnode as ElementNode, container)
    } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        // if vnode -> process the vnode 
        processComponent(vnode, container)
    }
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
    const { shapeFlags, type, props, children } = vnode
    const element = vnode.el = createElement(type)

    if (isObject(props)) {

        for (const attr of Object.keys(props!)) {
            if (isOn(attr)) {
                element.addEventListener(attr.substring(2).toLowerCase(), props![attr])
            }
            element.setAttribute(attr, props![attr])
        }
    }

    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
        element.textContent = String(children)
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
        (children as VNode[]).forEach((node) => {
            patch(node, element)
        })
    }

    container.append(element)
}
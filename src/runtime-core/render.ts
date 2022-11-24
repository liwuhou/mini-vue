import { createComponentInstance, setupComponent } from './index'
import type { VNode } from './index'
import { ComponentInstance } from './component'
import { Component } from './vnode'

type Container = HTMLElement
export type Render = (vnode: VNode, container: Container) => void

export const render: Render = (vnode, container) => {
    // patch 
    patch(vnode, container)
}

type Patch = (node: VNode, container: Container) => void
const patch: Patch = (vnode, container) => {
    // TODO: check the tyep of the node:
    // if vnode -> process the vnode 
    processComponent(vnode, container)

    // if element -> mount the element to view
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
    const subTree = (instance as Component)?.render?.() as VNode // FIXME: Text type will to do something
    // vnode -> patch => dom ,mounted the root component

    patch(subTree, container)
}

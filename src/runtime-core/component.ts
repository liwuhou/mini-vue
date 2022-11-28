import type { UserEmit } from './componentEmit';
import type { Component, SetupResult, VNode, VNodeType } from './index';
import type { Props } from './vnode';

import { shallowReadonly } from '../reactivity/reactive';
import { isObject } from '../shared/index';
import { emit } from './componentEmit';
import { initProps } from './componentProps';
import { publicProxyHandlers } from './componentPublicProxyHandler';
import { initSlots } from './componentSlots';

export type Slots = Record<string, VNode[] | string[]>

export type ComponentInstance = {
    vnode: VNode
    type?: VNodeType
    setupState?: SetupResult
    proxy?: Record<string, any>
    props?: Props
    slots?: Slots
    emit: UserEmit
}
export type CreateComponentInstance = (vnode: VNode) => ComponentInstance
export const createComponentInstance: CreateComponentInstance = (vnode) => {
    const instance: ComponentInstance = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: () => { }
    }
    instance.emit = emit.bind(null, instance)

    return instance
}

export type SetupComponent = (instance: ComponentInstance) => void;
export const setupComponent: SetupComponent = (instance) => {
    initProps(instance, instance.vnode.props)
    initSlots(instance, instance.vnode.children as Slots)
    setupStatefulComponent(instance)
};


export type SetupStatefulComponent = (instance: ComponentInstance) => void
export const setupStatefulComponent: SetupStatefulComponent = (instance) => {
    instance.type = instance.vnode.type
    const component = instance.type
    const { setup } = component as Component
    const setupResult = (typeof setup === 'function' ? setup(shallowReadonly(instance?.props ?? {}), {
        emit: instance.emit,
    }) : setup) ?? {}

    handleSetupResult(instance, setupResult)

    instance.proxy = new Proxy({
        _: instance
    }, publicProxyHandlers)
}

type HandleSetupResult = (instance: ComponentInstance, result: SetupResult) => void
const handleSetupResult: HandleSetupResult = (instance, result) => {
    //TODO: handle setupResult type is function

    if (isObject(result)) {
        instance.setupState = result
    }

    finishComponentSetup(instance)
}


// fill the setup result in component
type FinishComponentSetup = (instance: ComponentInstance) => void
const finishComponentSetup: FinishComponentSetup = (instance) => {
    // Implement
    const component = instance.type

        ; (component as Component)?.render?.()
}

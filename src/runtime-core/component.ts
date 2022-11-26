import { isObject } from '../shared/index';
import { VNode, VNodeType, Component } from './index'
import type { SetupResult } from './index'
import { publicProxyHandlers } from './componentPublicProxyHandler';

export type ComponentInstance = {
    vnode: VNode
    type?: VNodeType
    setupState?: SetupResult
    proxy?: Record<string, any>
}
export type CreateComponentInstance = (vnode: VNode) => ComponentInstance
export const createComponentInstance: CreateComponentInstance = (vnode) => {
    const instance = {
        vnode
    }

    return instance
}

export type SetupComponent = (instance: ComponentInstance) => void;
export const setupComponent: SetupComponent = (instance) => {
    // TODO:
    // initProps
    // initSlots
    setupStatefulComponent(instance)
};

export type SetupStatefulComponent = (instance: ComponentInstance) => void
export const setupStatefulComponent: SetupStatefulComponent = (instance) => {
    instance.type = instance.vnode.type
    const component = instance.type
    const { setup } = component as Component
    const setupResult = (typeof setup === 'function' ? setup(instance) : setup) ?? {}

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

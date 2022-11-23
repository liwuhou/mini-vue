import { isObject } from './../shared';
import { VNode, VNodeType, Component } from '.'
import type { SetupResult } from '.'

export type ComponentInstance = {
    vnode: VNode,
    type?: VNodeType
    setupState?: SetupResult
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
    const component: VNodeType = instance.vnode.type
    instance.type = instance.vnode.type
    const { setup } = component as Component

    if (typeof setup === 'function') {
        const setupResult = setup(instance)

        handleSetupResult(instance, setupResult)
    }
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
    const Component = instance.type

    if ((Component as Component)?.render) {

    }
}

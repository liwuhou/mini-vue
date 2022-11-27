import { isArray, isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
import type { ComponentInstance } from "./component"

type Props = Record<string, any>
type Children = VNode[] | string

export type SetupResult = Record<string, any> | void
export type Component = {
    data?: () => Record<string, any>
    setup?: ((insance: ComponentInstance) => SetupResult) | SetupResult
    render?: (setupResult?: SetupResult) => VNode
    computed?: () => void // TODO
}
export type VNodeType = Component | string

export type VNode = {
    type: VNodeType,
    props?: Props
    children?: Children
    el: null | Element
    shapeFlags: number
}
export type CreateVNode = (type: string, props?: Props, children?: Children) => VNode

export const createVNode: CreateVNode = (type, props, children) => {
    return {
        type,
        props,
        children,
        el: null,
        shapeFlags: getShapeFlags(type, children)
    }
}

export type GetShapeFlags = (type: VNodeType, children?: Children) => number
export const getShapeFlags: GetShapeFlags = (type, children) => {
    let shapeFlags = 0
    if (typeof type === 'string') {
        shapeFlags |= ShapeFlags.ELEMENT
    } else if (isObject(type)) {
        shapeFlags |= ShapeFlags.STATEFUL_COMPONENT
    }

    if (typeof children === 'string') {
        shapeFlags |= ShapeFlags.TEXT_CHILDREN
    } else if (isArray(children)) {
        shapeFlags |= ShapeFlags.ARRAY_CHILDREN
    }

    return shapeFlags
}
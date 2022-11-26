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
}
export type CreateVNode = (type: string, props?: Props, children?: Children) => VNode

export const createVNode: CreateVNode = (type, props, children) => {
    return {
        type,
        props,
        children,
        el: null
    }
}
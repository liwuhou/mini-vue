
type RenderFunction = () => VNode
type Props = Record<string, any>
type Children = VNode[] | string

export type SetupResult = RenderFunction | Record<string, any> | void
export type Component = {
    data?: () => Record<string, any>
    setup?: (this: void, props: Props) => SetupResult
    render?: (setupResult?: SetupResult) => VNode
    computed?: () => void // TODO
}
export type VNodeType = Component | string

export type VNode = {
    type: VNodeType,
    props?: Props
    children?: Children
}
export type createVNode = (type: string, props?: Props, children?: Children) => VNode

export const createVNode: createVNode = (type, props, children) => {
    return {
        type,
        props,
        children
    }
}
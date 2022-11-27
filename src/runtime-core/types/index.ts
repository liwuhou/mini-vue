export interface Vnode {
    type: any,
    props: any,
    children: any,
    shapeFlag: number,
    el: any
}

export interface Component {
    vnode: Vnode,
    type: object,
    render: Function,
    proxy: object,
    setupState: object,
    props: any,
    emit: Function,
    slots: object,
    provides: object,
    parent: Component | null,
}

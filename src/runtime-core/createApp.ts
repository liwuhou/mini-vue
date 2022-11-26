import { render, createVNode } from './index'

export type AppComponent = {
    mounted(container: string | Element): void
}
export type CreateApp = (rootComponent: string) => AppComponent

export const createApp: CreateApp = (rootComponent) => {
    return {
        mounted(rootContainer) {
            const rootElement = findElement(rootContainer)
            // transform vnode
            const vnode = createVNode(rootComponent)

            render(vnode, rootElement)
        }
    }
}

const findElement = (rootStr: string | Element): Element | never => {
    if (typeof rootStr === 'string') {
        const elm = document.querySelector(rootStr)
        if (!elm) throw new TypeError('Mounte method need a Element!')

        return elm
    } else {
        return rootStr
    }
}
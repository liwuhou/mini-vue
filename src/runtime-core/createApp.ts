import { render, createVNode } from './index'

export type AppComponent = {
    mounted(container: string | HTMLElement): void
}
export type CreateApp = (rootComponent: string) => AppComponent

export const createApp: CreateApp = (rootComponent) => {
    return {
        mounted(rootContainer) {
            const rootElement = findElement(rootContainer)
            // transform vnode
            const vnode = createVNode(rootComponent)

            render(vnode, rootElement!)
        }
    }
}

const findElement = (rootStr: string | HTMLElement): HTMLElement | null => {
    if (typeof rootStr === 'string') {
        return document.querySelector(rootStr)
    } else {
        return rootStr
    }
}
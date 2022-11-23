import { createVNode } from '.';
import { render } from '.'

export type AppComponent = {
    mounted(container: string | HTMLElement): void
}
export type CreateApp = (rootComponent: string) => AppComponent

export const createApp: CreateApp = (rootComponent) => {
    return {
        mounted(rootContainer) {
            // transform vnode
            const vnode = createVNode(rootComponent)

            render(vnode, rootContainer)
        }
    }
}

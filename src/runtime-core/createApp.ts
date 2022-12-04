import type { Renderer } from './renderer'
import { createVNode } from './vnode'

export type AppComponent = {
  mounted(container: string | Element): void
}

export type CreateApp = (rootComponent: string) => AppComponent

type CreateAppAPI = (renderer: Renderer, findElement: (root: string | Element) => Element) => CreateApp
export const createAppAPI: CreateAppAPI = (renderer, findElement) => {
  return (rootComponent) => {
    return {
      mounted(rootContainer) {
        const rootElement = findElement(rootContainer)
        // transform vnode
        const vnode = createVNode(rootComponent)

        renderer(vnode, rootElement)
      }
    }
  }
}

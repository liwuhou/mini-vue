import { effect } from './index.js'
import { mountElement } from './render.js'

export function createApp(rootComponent) {
    // app
    return {
        mounted(rootContainer) {
            const setResult = rootComponent.setup()
            let isMounted = false
            let prevSubTree
            console.log(setResult)

            effect(() => {
                // rootContainer.textContent = ``
                if (!isMounted) {
                    isMounted = true
                    const subTree = rootComponent.render(setResult)
                    prevSubTree = subTree
                    mountElement(subTree, rootContainer)
                } else {
                    const subTree = rootComponent.render(setResult)
                    console.log('old', prevSubTree)
                    console.log('new', subTree)
                    prevSubTree = subTree
                    // TODO: Diff

                }
            })
        }
    }
}
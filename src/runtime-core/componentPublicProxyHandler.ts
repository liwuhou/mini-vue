import { ComponentInstance } from "./component"

interface PublicPropertiesMap {
    [key: string | symbol]: (instance: ComponentInstance) => any
}
const publicPropertiesMap: PublicPropertiesMap = {
    $el: (i) => i.vnode.el
}

export const publicProxyHandlers: ProxyHandler<{ _: ComponentInstance }> = {
    get({ _: instance }, key) {
        const { setupState = {} } = instance
        if (key in setupState) {
            return Reflect.get(setupState, key)
        } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance)
        }
    },
}
import { hasOwn } from "../shared/index"
import { ComponentInstance } from "./component"

interface PublicPropertiesMap {
    [key: string | symbol]: (instance: ComponentInstance) => any
}
const publicPropertiesMap: PublicPropertiesMap = {
    $el: (i) => i.vnode.el
}

export const publicProxyHandlers: ProxyHandler<{ _: ComponentInstance }> = {
    get({ _: instance }, key) {
        const { setupState = {}, props = {} } = instance
        if (hasOwn(setupState, key)) {
            return Reflect.get(setupState, key)
        } else if (hasOwn(props, key)) {
            return Reflect.get(props, key)
        } else if (hasOwn(publicPropertiesMap, key)) {
            return publicPropertiesMap[key](instance)
        }
    },
}
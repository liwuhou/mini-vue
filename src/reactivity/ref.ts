import { Dep } from '.'

type ProxyedRef<T = any> = {
    value: T
}

export function ref<T = any>(value: T): ProxyedRef<T> {
    const deps = new Dep()
    return new Proxy({ value }, {
        get(target, key) {
            if (key === 'value') {
                deps.depend()
                return Reflect.get(target, key)
            }
        },
        set(target, key, value) {
            if (key === 'value') {
                const result = Reflect.set(target, key, value)
                deps.notify()
                return result
            }
            return false
        }
    })
}
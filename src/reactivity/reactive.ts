import { track, trigger } from '.'

export function reactive<T extends Object>(raw: T): T {

    return new Proxy(raw, {
        get(target, key) {
            track(target, key)

            return Reflect.get(target, key)
        },
        set(target, key, value) {
            const result = Reflect.set(target, key, value)
            trigger(target, key)

            return result
        }
    })
}
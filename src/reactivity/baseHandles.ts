import { track, trigger } from "."

type Key = string | symbol
interface BaseHandles {
    get(target: Object, key: Key): void
    set(target: Object, key: Key, value: any): boolean
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter<T extends Object>(isReadonly = false) {
    return function (target: T, key: string | symbol) {
        if (!isReadonly) track(target, key)

        return Reflect.get(target, key)
    }
}

function createSetter<T extends Object>() {
    return function (target: T, key: Key, value: any) {
        const result = Reflect.set(target, key, value)
        trigger(target, key)

        return result
    }
}

export const mutationHandlers: BaseHandles = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set() {
        console.error('readonly type data can\t set anything.')
        return true
    }
}

export function createActiveHandle<T extends Object>(raw: T, baseHandlres: BaseHandles): T {
    return new Proxy<T>(raw, baseHandlres)
}

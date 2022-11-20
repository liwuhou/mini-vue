import { track, trigger } from "."
import { ReactiveFlags } from './reactive'

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
        if (key === ReactiveFlags.IS_REACTIVE) return !isReadonly
        if (key === ReactiveFlags.IS_READONLY) return isReadonly
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

export type ProxiedObject<T extends Record<string, any> = {}> = {
    [key in keyof T]: T[key]
} & {
    [ReactiveFlags.IS_REACTIVE]: boolean
}

export function createActiveHandle<T extends Object>(raw: T, baseHandlres: BaseHandles): ProxiedObject<T> {
    return new Proxy<ProxiedObject<T>>(raw as ProxiedObject<T>, baseHandlres)
}

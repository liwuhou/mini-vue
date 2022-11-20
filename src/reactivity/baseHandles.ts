import { track, trigger } from "."
import { extend, isObject } from "../shared"
import { reactive, ReactiveFlags, readonly } from './reactive'

type Key = string | symbol
interface BaseHandles {
    get(target: Object, key: Key): void
    set(target: Object, key: Key, value: any): boolean
}

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

function createGetter<T extends Object>(isReadonly = false, isShallow = false) {
    return function (target: T, key: string | symbol) {
        if (key === ReactiveFlags.IS_REACTIVE) return !isReadonly
        if (key === ReactiveFlags.IS_READONLY) return isReadonly
        if (isShallow) return Reflect.get(target, key)

        const res = Reflect.get(target, key)
        if (!isReadonly) track(target, key)


        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }

        return res
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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})

export type ReadonlyObject<T extends Record<string, any> = {}> = {
    readonly [key in keyof T]: T[key]
} & {
    [ReactiveFlags.IS_READONLY]?: boolean
}

export type ProxiedObject<T extends Object = {}> = {
    [key in keyof T]: T[key]
} & {
    [ReactiveFlags.IS_REACTIVE]?: boolean
}

export function createActiveHandle<T extends Object>(raw: T, baseHandlres: BaseHandles): ProxiedObject<T>
export function createActiveHandle<T extends Object>(raw: T, baseHandlres: BaseHandles): ReadonlyObject<T> {
    return new Proxy<ProxiedObject<T>>(raw as ProxiedObject<T>, baseHandlres)
}

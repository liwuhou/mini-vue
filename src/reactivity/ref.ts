import { trackEffects, triggerEffects, reactive } from './index'
import type { ReactiveEffect } from './effect'
import { hasChange, isObject } from '../shared/index'

export type BaseTypes = string | number | boolean
export interface Ref<T = any> {
    value: T
    __v_isRef: boolean
}
export type ShallowRef<T = any> = Ref<T>

export type UnwrapRef<T> = T extends ShallowRef<infer V>
    ? V
    : T extends Ref<infer V>
    ? UnwrapRefSimple<V>
    : UnwrapRefSimple<T>

export type UnwrapRefSimple<T> = T extends
    | Function
    | BaseTypes
    | Ref
    ? T
    : T extends ReadonlyArray<any>
    ? { [K in keyof T]: UnwrapRefSimple<T[K]> }
    : T


class RefImpl<T extends object | BaseTypes = any>{
    private _value: T
    private _rawValue: T
    public readonly __v_isRef: boolean = true
    public dep: Set<ReactiveEffect>
    constructor(value: T) {
        this._rawValue = value
        this._value = convert<T>(value)
        this.dep = new Set()
    }

    get value(): T {
        trackEffects(this.dep)
        return this._value
    }

    set value(newValue) {
        if (hasChange(newValue, this._rawValue)) return

        this._rawValue = newValue
        this._value = convert(newValue)
        triggerEffects(this.dep)
    }
}

function convert<T extends Object>(value: T): T {
    return isObject(value) ? reactive<T>(value) : value as T
}

export function ref<T extends BaseTypes | Object>(value: T): Ref<T> {
    return new RefImpl<T>(value)
}

export function isRef<T>(ref: Ref<T> | unknown): ref is Ref<T> {
    return (!!ref && (ref as Ref<T>).__v_isRef === true)
}

export function unRef<T>(ref: T | Ref<T>): T {
    return isRef(ref) ? (ref.value as any) : ref
}

export function proxyRef<T extends Record<string | symbol, any>>(ObjectWithRefs: T): T {
    return new Proxy<T>(ObjectWithRefs, {
        get(target: T, key: string) {
            return unRef(Reflect.get(target, key))
        },
        set(target: T, key: string | symbol, value: any) {
            if (isRef(Reflect.get(target, key)) && !isRef(value)) {
                return target[key].value = value
            } else {
                return Reflect.set(target, key, value)
            }
        }
    })
}
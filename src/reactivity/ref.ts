import { trackEffects, triggerEffects } from './effect'
import type { ReactiveEffect } from './effect'
import { hasChange, isObject } from '../shared'
import { reactive } from './reactive'
import { ProxiedObject } from './baseHandles'

class RefImpl<T>{
    private _value: T | ProxiedObject<Object>
    private _rawValue: T | ProxiedObject<Object>
    public dep: Set<ReactiveEffect>
    constructor(value: T) {
        this._rawValue = value
        this._value = convert<T>(value)
        this.dep = new Set()
    }

    get value(): T | ProxiedObject<Object> {
        trackEffects(this.dep)
        return this._value
    }

    set value(newValue: T | Object) {
        if (hasChange(newValue, this._rawValue)) return

        this._rawValue = newValue
        this._value = convert(newValue)
        triggerEffects(this.dep)
    }
}

function convert<T extends unknown>(value: T): T | ProxiedObject<Object> {
    return isObject(value) ? reactive(value as Object) : value
}

export function ref<T extends unknown>(value: T): RefImpl<T> {
    return new RefImpl<T>(value)
}

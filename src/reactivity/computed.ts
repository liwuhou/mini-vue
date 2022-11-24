import { hasChange } from "../shared/index"
import { ReactiveEffect } from './index'

class ComputedRefImpl<T> {
    private _getter: () => T
    private _dirty: any = true
    private _value?: T
    private _effect: ReactiveEffect
    constructor(getter: () => T) {
        this._getter = getter
        this._effect = new ReactiveEffect(getter, {
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true
                }
            }
        })
    }

    get value() {
        if (this._dirty) {
            this._dirty = false
            this._value = this._effect.run()
        }
        return this._value
    }

    set value(newValue) {
        if (hasChange(newValue, this._value)) {

        }
    }
}

export function computed<T>(getter: () => T): ComputedRefImpl<T> {

    return new ComputedRefImpl(getter)
}
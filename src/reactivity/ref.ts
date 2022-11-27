import { trackEffects, triggerEffects } from './effect'
import { reactive } from './reactive'
import { isObject } from './tool'

class RefImpl {
    private _value: any;
    public dep;
    public __v_isRef = true;
    constructor(value) {
        if (isObject(value)) {
            this._value = reactive(value);
        } else {
            this._value = value
        }
        this.dep = new Set();
    }

    get value() {
        trackEffects(this.dep);
        return this._value;
    }

    set value(newValue) {
        if (newValue === this._value) return;
        this._value = newValue;
        triggerEffects(this.dep);
    }

    unRef () {
        return this._value;
    }
}

export function isRef(value: any) {
    return !!value.__v_isRef;
}

export function ref(value) {
    return new RefImpl(value);
}

export function unRef(value: any) {
    if (isRef(value)) return value.unRef();
    return value;
}

export function proxyRefs(obj) {
    return new Proxy(obj, {
        get(target, key) {
            return unRef(Reflect.get(target, key));
        },

        set(target, key, value) {
            if (isRef(target[key]) && !isRef(value)) {
                target[key].value = value;
                return true;
            } else {
                return Reflect.set(target, key, value);
            }
        }
    })
}

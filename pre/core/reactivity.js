let workInProcessFn = null

export class Dep {
    constructor() {
        this.deps = new Set()
    }

    depend() {
        if (typeof workInProcessFn === 'function') {
            this.deps.add(workInProcessFn)
        }
    }

    notify() {
        this.deps.forEach((dep) => dep())
    }
}

export const ref = (value) => {
    const wrap = {}
    const dep = new Dep()
    wrap.value = value
    return new Proxy(wrap, {
        get(target, prop) {
            // 收集依赖
            if (prop === 'value') {
                dep.depend()
            }
            return target[prop]
        },
        set(target, prop, value) {
            if (prop === 'value') {
                target[prop] = value
                // 执行依赖
                dep.notify()
                return true
            }
            return false
        }
    })
}

const getDep = (depMap, key) => {
    return depMap.get(key) ?? (depMap.set(key, new Dep()),getDep(depMap, key))
}

export const reactive = (raw) => {
    const depMap = new Map()

    return new Proxy(raw, {
        get(target, key) {
            const dep = getDep(depMap, key)
            dep.depend()
            return Reflect.get(target, key)
        },
        set(target, key, value) {
            Reflect.set(target, key, value)
            const dep = getDep(depMap, key)
            dep.notify()
            return true
        }
    })
}

export const effect = (fn) => {
    (workInProcessFn = fn)();
    workInProcessFn = null
}

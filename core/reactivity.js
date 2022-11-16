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

export const effect = (fn) => {
    (workInProcessFn = fn)();
    workInProcessFn = null
}

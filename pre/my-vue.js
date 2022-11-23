let tmpFn = null

export const ref = (value) => {
    const wrap = {}
    const deps = []
    wrap.value = value
    return new Proxy(wrap, {
        get(target, prop) {
            // 收集依赖
            if (prop === 'value') {
                if (tmpFn) {
                    deps.push(tmpFn)
                    tmpFn = null
                }
            }
            return target[prop]
        },
        set(target, prop, value) {
            if (prop === 'value') {
                target[prop] = value
                deps.forEach((fn) => fn())
                return true
            }
            // 执行依赖
            return false
        }
    })
}

export const effect = (fn) => {
    tmpFn = fn;
    tmpFn()
}

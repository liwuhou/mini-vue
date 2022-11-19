let activeEffect: ReactiveEffect | null = null

export class ReactiveEffect {
    private _fn: () => any

    constructor(_fn: () => any) {
        this._fn = _fn
    }

    run() {
        activeEffect = this
        return this._fn()
    }
}

export type IKey = string | symbol
const targetMap = new WeakMap()
const getDep: (target: Object, key: IKey) => Set<ReactiveEffect> = (target, key) => {
    let map = targetMap.get(target) ?? (targetMap.set(target, new Map()), targetMap.get(target))

    return map.get(key) ?? (map.set(key, new Set()), map.get(key))
    // const targetKeyMap = targetMap.get(target) ?? targetMap.set(target, new Map()).get(target)
    // return targetKeyMap.get(key) ?? (targetKeyMap.set(key, new Set()), targetKeyMap.get(key))
}

export function track(target: Object, key: IKey) {
    const deps = getDep(target, key)

    if (activeEffect) {
        deps.add(activeEffect)
    }
}

export function trigger(target: Object, key: IKey) {
    const deps = getDep(target, key)

    for (const dep of deps) {
        dep.run()
    }
}

export function effect(fn: () => any) {
    const _effect = new ReactiveEffect(fn)

    _effect.run()
    return _effect.run.bind(_effect)
}
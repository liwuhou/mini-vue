let activeEffect: ReactiveEffect | null = null

export class ReactiveEffect {
    private _fn: () => any

    constructor(_fn: () => any, public scheduler?: Scheduler) {
        this._fn = _fn
        this.scheduler = scheduler
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
        if (dep?.scheduler) {
            dep.scheduler()
        } else {
            dep.run()
        }
    }
}

type Scheduler = () => void
interface EffectOption {
    scheduler?: Scheduler
}
export function effect(fn: () => any, option?: EffectOption) {
    const _effect = new ReactiveEffect(fn, option?.scheduler)

    _effect.run()
    return _effect.run.bind(_effect)
}
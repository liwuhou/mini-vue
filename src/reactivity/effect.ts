let activeEffect: ReactiveEffect | null = null
let shouldTrack: boolean = false

type Runner = {
    (): any
    effect: ReactiveEffect
}
export class ReactiveEffect {
    private _fn: () => any
    public deps: Set<ReactiveEffect>[] = []
    public scheduler
    public onStop
    // Is this effect active or Is it be stop?
    private _active: boolean = true

    constructor(_fn: () => any, option?: EffectOption) {
        this._fn = _fn
        this.scheduler = option?.scheduler
        this.onStop = option?.onStop
    }

    run() {
        if (!this._active) return this._fn()

        shouldTrack = true
        activeEffect = this
        const result = this._fn()
        shouldTrack = false

        return result
    }

    stop() {
        if (this._active) {
            cleanEffect(this)
            this?.onStop?.()
            this._active = false
        }
    }
}

function cleanEffect(effect: ReactiveEffect) {
    effect.deps.forEach((dep) => {
        dep.delete(effect)
    })
}

export type IKey = string | symbol
const targetMap = new WeakMap()
const getDep: (target: Object, key: IKey) => Set<ReactiveEffect> = (target, key) => {
    let map = targetMap.get(target) ?? (targetMap.set(target, new Map<IKey, Set<ReactiveEffect>>()), targetMap.get(target)!)

    return map.get(key) ?? (map.set(key, new Set<ReactiveEffect>()), map.get(key))
}

function isTracking() {
    return activeEffect !== null && shouldTrack
}

export function track(target: Object, key: IKey) {
    if (!isTracking()) return

    const dep = getDep(target, key)
    trackEffects(dep)
}

export function trackEffects(dep: Set<ReactiveEffect>) {
    if (!isTracking()) return
    if (dep.has(activeEffect!)) return

    dep.add(activeEffect!)
    activeEffect?.deps.push(dep)
}

export function trigger(target: Object, key: IKey) {
    const deps = getDep(target, key)

    triggerEffects(deps)
}

export function triggerEffects(deps: Set<ReactiveEffect>) {
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
    onStop?: () => any
}
export function effect(fn: () => any, option?: EffectOption) {
    const _effect = new ReactiveEffect(fn, option)

    _effect.run()

    const runner = _effect.run.bind(_effect) as Runner
    runner.effect = _effect

    return runner
}

export function stop(runner: Runner) {
    runner.effect.stop()
}

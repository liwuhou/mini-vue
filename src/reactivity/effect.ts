let shouldTrack;
export class ReactiveEffect {
    private _fn: any;
    public scheduler: any;
    deps = [];
    active = true;
    onStop?:() => void;
    constructor(fn, scheduler?) {
        this._fn = fn;
        this.scheduler = scheduler;
    }
    run () {
        activeEffect = this;
        shouldTrack = true;
        return this._fn();
    }
    stop () {
        if (this.active) {
            this.deps.forEach((dep: any) => {
                dep.delete(this);
            })
            if (this.onStop) {
                this.onStop();
            }
            this.active = false;
            shouldTrack = false
        }
    }
}
// 收集依赖
const targetMap = new Map();
export function track(target, key) {
    if (!shouldTrack) return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }

    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}
// 触发依赖
export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);

    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}


let activeEffect;
export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.onStop = options.onStop;
    _effect.run();
    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;

    return runner
}

export function stop (runner) {
    runner.effect.stop();
}

export function trackEffects(dep) {
    if (!dep.has(activeEffect)) {
        dep.add(activeEffect);
    }
}

export function triggerEffects(dep) {
    dep.forEach(effect => {
        effect.run();
    })
}

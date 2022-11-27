import { track, trigger } from "./effect";
import { isObject } from "./tool";
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
    IS_REACTIVE = "IS_REACTIVE",
    IS_READONLY = "IS_READONLY"
}

export function reactive(raw) {
    return createReactiveObject(raw, mutableHandlers);
}

export function isReactive(value) {
    return Boolean(value[ReactiveFlags.IS_REACTIVE]);
}

export function isReadonly(value) {
    return Boolean(value[ReactiveFlags.IS_READONLY]);
}

export function isProxy(value) {
    return isReactive(value) || isReadonly(value);
}

export function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}

function createReactiveObject(target: object, baseHandlers: object) {
    if(!isObject(target)) {
        return console.warn("createActiveObject only accept object type !!!")
    }
    return new Proxy(target, baseHandlers)
}


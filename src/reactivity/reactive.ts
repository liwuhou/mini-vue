import { mutationHandlers, readonlyHandlers, createActiveHandle } from './baseHandles'
import type { ProxiedObject } from './baseHandles'

export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
}

export function reactive<T extends Object>(raw: T): ProxiedObject<T> {
    return createActiveHandle<T>(raw, mutationHandlers)
}

export function readonly<T extends Object>(raw: T): ProxiedObject<T> {
    return createActiveHandle<T>(raw, readonlyHandlers)
}

export function isReactive(value: Record<string, any>): boolean {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value: Record<string, any>): boolean {
    return !!value[ReactiveFlags.IS_READONLY]
}
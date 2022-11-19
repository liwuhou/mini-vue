import { mutationHandlers, readonlyHandlers, createActiveHandle } from './baseHandles'


export function reactive<T extends Object>(raw: T): T {
    return createActiveHandle<T>(raw, mutationHandlers)
}

export function readonly<T extends Object>(raw: T): T {
    return createActiveHandle(raw, readonlyHandlers)
}
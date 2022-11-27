export const extend = Object.assign

export const isObject = (val: unknown): boolean => !!val && typeof val === 'object'

export const isArray = (val: unknown): boolean => Array.isArray(val)

export const hasChange = (val1: unknown, val2: unknown): boolean => Object.is(val1, val2)

export const isOn = (eventName: string): boolean => /^on[A-Z]/.test(eventName)

export const hasOwn = (obj: Record<string | symbol, any>, key: string | symbol): boolean => Object.prototype.hasOwnProperty.call(obj, key)
export const extend = Object.assign

export const isObject = (val: unknown): boolean => !!val && typeof val === 'object'

export const hasChange = (val1: unknown, val2: unknown): boolean => Object.is(val1, val2)
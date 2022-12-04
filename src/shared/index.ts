export const extend = Object.assign

export const EMPTY_OBJ = Object.create(null)

export const isObject = (val: unknown): boolean => !!val && typeof val === 'object'

export const isArray = (val: unknown): boolean => Array.isArray(val)

export const hasChange = (val1: unknown, val2: unknown): boolean => Object.is(val1, val2)

export const isOn = (eventName: string): boolean => /^on[A-Z]/.test(eventName)

export const hasOwn = (obj: Record<string | symbol, any>, key: string | symbol): boolean => Object.prototype.hasOwnProperty.call(obj, key)

// type ToCapitalizeCase<T extends string> = (title: T) => T extends `${infer H}${infer Rest}` ? `${Uppercase<H>}${Rest}` : T
export const toCapitalizeCase = (title: string): string => `${title.charAt(0).toUpperCase()}${title.slice(1)}`

export const camelize = (title: string): string => title.replace(/-(\w)/g, (_, c: string) => {
  return c ? c.toUpperCase() : ''
})
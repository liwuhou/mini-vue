import { getCurrentInstance } from "./component"

type Provide<T extends unknown = any> = (key: string, value: T) => void
export const provide: Provide = (key, value) => {
  const currentInstance = getCurrentInstance()

  if (currentInstance) {
    let { provides } = currentInstance
    const parentProvides = currentInstance.parent?.provides ?? null

    // init current provies's prototype chain
    if (provides === parentProvides) {
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    provides[key] = value
  }
}

type Inject<T extends unknown = any> = (key: string, defaultValue?: T | (() => T)) => T
export const inject: Inject = (key, defaultValue) => {
  const currentInstance = getCurrentInstance()

  if (currentInstance) {
    const { parent } = currentInstance
    const parentProvides = parent?.provides ?? {}

    if (Reflect.has(parentProvides, key)) {
      return Reflect.get(parentProvides, key)
    } else {
      if (typeof defaultValue === 'function') {
        return defaultValue()
      } else {
        return defaultValue
      }
    }
  }

}
import { track } from "./effect"

export class Dep {
  deps: Set<() => {}>

  constructor() {
    this.deps = new Set()
  }

  depend() {
    track(this, 'value')
  }

  notify() {
    this.deps.forEach((dep) => dep?.())
  }
}
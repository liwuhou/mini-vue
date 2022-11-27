import { camelize, toCapitalizeCase } from "../shared/index"
import type { ComponentInstance } from "./component"

export type UserEmit = (event: string, ...args: any[]) => any
export type Emit = (instance: ComponentInstance, event: string, ...args: any[]) => any
export const emit: Emit = (instance, event, ...args) => {
    const { props = {} } = instance


    return props?.[`on${camelize(toCapitalizeCase(event))}`]?.(...args)
}
import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
import { ComponentInstance, Slots } from "./component"

type InitSlots = (instance: ComponentInstance, children?: Slots | string) => void
export const initSlots: InitSlots = (instance, children) => {
    const { vnode } = instance

    if (vnode.shapeFlags & ShapeFlags.SLOT_CHILDREN) {
        instance.slots = getNormallizeSlots(instance, children)
    }
}

function getNormallizeSlots(instance: ComponentInstance, children?: Slots | string) {
    if (!children) return instance.slots = {}
    const slots: Slots = {}

    if (isObject(children)) {
        if (Array.isArray(children)) {
            for (const key in children) {
                if (Object.prototype.hasOwnProperty.call(children, key)) {
                    const value = children[key];
                    slots[key] = Array.isArray(value) ? value : [value]
                }
            }
        } else {
            Object.assign(slots, children)
        }

    } else {
        slots['default'] = [children as unknown as string]
    }

    return slots
}
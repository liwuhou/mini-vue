import type { Children, VNode } from '../vnode'
import { createVNode, Fragment } from '../vnode'

type SlotsProps = Record<string, any>
type SlotsVNode = Children | ((props?: SlotsProps) => Children)
type RenderSlots = (slots?: Record<string, SlotsVNode>, name?: string, props?: SlotsProps) => VNode | ''
export const renderSlots: RenderSlots = (slots, name = 'default', props) => {
  if (!slots) return ''
  const slot = slots?.[name] ?? slots
  // TODO: 使用 Fragment
  return createVNode(Fragment, {}, getNormalSlot(slot, props))
}

function getNormalSlot(slot: SlotsVNode, props?: SlotsProps): Children {
  const res = typeof slot === 'function' ? slot(props) : slot
  return Array.isArray(res)
    ? res
    : typeof res === 'string'
      ? res
      : [res]
}
import type { CreateVNode } from "./vnode"
import { createVNode } from "./vnode"

export type H = CreateVNode
export const h: H = (type, props, children) => createVNode(type, props, children)

import { ShapeFlags } from "../shared/shapeFlags";
import { Component } from "./types/index";

/**
 * 初始化插槽
 * @param instance 
 * @param children 
 */
export function initSlots(instance: Component, children: any) {
    const { shapeFlag } = instance.vnode;

    // 如果是插槽类型，才进行处理
    if(shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(children, (instance.slots = {}));
    }
}

/**
 * 处理slot返回的值，转换成array
 * @param value 
 * @returns 
 */
const normalizeSlotValue = (value: any) => {
    return Array.isArray(value) ? value : [value];
  };

const normalizeObjectSlots = (rawSlots, slots) => {
    for (const key in rawSlots) {
      const value = rawSlots[key];
      if (typeof value === "function") {
        slots[key] = (props) => normalizeSlotValue(value(props));
      }
    }
  };

import { hasQwnProperty } from "../shared/index";
import { Component } from "./types/index";

// 公共属性值
const publicPropertiesMap = {
    $el: (ins: Component) => ins.vnode.el,
    $slots: (ins: Component) => ins.slots,
}

// 实例公共处理方法
export const componentPublicInstance = {
    get({_instance: instance}, key) {
        // 拿到setupState
        const { setupState, props } = instance;
        
        // 返回属性值，判断当前属性是否在当前对象上
        if(hasQwnProperty(setupState, key)) {
            return setupState[key]
        }else if(hasQwnProperty(props, key)){
            return props[key]
        }

        //公共属性值-统一特殊处理
        const publicPropertyGetter = publicPropertiesMap[key];
        if(publicPropertyGetter) {
            return publicPropertyGetter(instance);
        }
    }
}
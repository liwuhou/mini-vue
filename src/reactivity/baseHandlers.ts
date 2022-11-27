import { isObject } from "./tool";
import { extend } from '../shared/index'
import { track, trigger } from "./effect";
import { reactive, ReactiveFlags, readonly } from "./reactive";
import { isRef, unRef } from "./ref";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true);

/**
 * 创建get
 * @param isReadonly 是否是只读
 * @returns 
 */
 function createGetter(isReadonly:boolean = false, shallow:boolean = false) {
    return function get(target, key) {
        
        // 如果当前传入的是获取是否是proxy的key
        if(key === ReactiveFlags.IS_REACTIVE){
            return !isReadonly;
        }
        // 如果当前传入的是获取是否是只读y的key
        else if(key === ReactiveFlags.IS_READONLY){
            return isReadonly;
        }

        // 获取当前值
        let res = Reflect.get(target, key);

        // 如果是ref对象，则直接重置值
        if(isRef(res)) {
            res = unRef(res);
        }
        // 如果只需要对一级对象进行只读处理，则直接返回值
        if(shallow) {
            return res;
        }

        // 如果不是只读，则进行依赖收集
        if(!isReadonly) {
            // 依赖收集
            track(target, key);
        }

        // 如果当前的值还是对象，需要把值转变成响应式对象
        if(isObject(res)){
            return isReadonly ? readonly(res) : reactive(res);
        }

        return  res;
    }
}

/**
 * 创建set
 * @returns 
 */
function createSetter() {
    return function set(target, key, value){
         // 设置当前值
         const res = Reflect.set(target, key, value);

         // 触发依赖
         trigger(target, key);
         return res;
    }
}

export const mutableHandlers = {
    get,
    set,
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value){
        console.warn(`key:${key} can not set, target is readonly!`)
        return true;
    }
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})

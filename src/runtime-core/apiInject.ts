import { getCurrentInstance } from "./component";

/**
 * 组件property注入
 * @param key 
 * @param value 
 */
 export function provide(key: string, value: any) {
    const curInstance = getCurrentInstance();
    if(curInstance) {
        let { provides } = curInstance;
        const parentProvides = curInstance.parent?.provides;

        // 如果当前的provides等于父级的provides，则初始化，将当前对象的原型链指向父组件的provides
        if(provides === parentProvides){
            provides = curInstance.provides = Object.create(parentProvides);
        }

        provides[key] = value;
    }
}

/**
 * 组件property获取
 * @param key 
 * @param defaultVal 默认值 
 */
export function inject(key: string, defaultVal: any) {
    const curInstance = getCurrentInstance();
    if(curInstance) {
        const { parent } = curInstance;
        if(parent  && (key in parent.provides)) {
            // 如果父组件有，则返回父组件属性值
            return parent.provides[key];
        }else if(typeof defaultVal === "function") {
            // 如果是方法，则直接执行方法
            return defaultVal();
        }else if(defaultVal) {
            // 返回默认值
            return defaultVal;
        }
    }
}

/**
 * 判断值是否是对象
 * @param val 
 * @returns 
 */
 export const isObject = (val: any) => {
    return val !== null && typeof val === "object";
};

/**
 * 对象继承
 */
export const extend =  Object.assign;

/**
 * 判断两个值是否相等
 * @param newVal 
 * @param oldVal 
 */
export const isChange = (newVal: any, oldVal: any) => {
    return !Object.is(newVal, oldVal);
}

/**
 * 是否是事件名（规范：onEventName）
 * @param name 名称
 * @returns 如果满足规范，则返回转换成小写的事件名，如果不满足，则直接返回空
 */
export const isEventName = (name: string) => {
    const isOn = /^on[A-Z]/.test(name);
    return isOn ? name.slice(2).toLowerCase() : ''
}

/**
 * 判断当前对象是否有某个属性
 * @param target 对象
 * @param k 属性
 * @returns 
 */
export const hasQwnProperty = (target: object, k: string) => {
    return Object.prototype.hasOwnProperty.call(target, k)
}

/**
 * 字符串首字母大写
 * @param name 
 * @returns 
 */
export const capitalize = (name: string) => {
    if(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }

    return name;
}

/**
 * 字符串驼峰化
 * @param str 
 * @param divide 分隔符 默认"-"
 * @returns 
 */
export const camelize = (str: string, divide: string = "-") => {
    return str.replace(new RegExp(`${divide}(\\w)`, "g"), (_: string, filterStr: string)=>{
        return filterStr ? filterStr.toUpperCase() : "";
    })
}

/**
 * 格式化emit的事件名
 * @param name 
 * @returns 
 */
export const formatEmitName = (name: string) => {
    return name ? `on${capitalize(name)}` : "";
}
